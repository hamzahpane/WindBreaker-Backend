const PDFDocument = require('pdfkit');
const fs = require('fs');
const { subject } = require('@casl/ability');
const Invoice = require('./model');
const Order = require('../Orders/model');
const Payment = require('../Payement/model');
const { policyfor } = require('../../util/index');



const createInvoice = async (req, res, next) => {
    try {
        const { order_id, payment_id } = req.body;

        let subjectInvoice = subject('Invoice', { order_id, user_id: req.user._id });

        // Periksa izin untuk membuat invoice
        if (!policyfor(req.user).can('create', subjectInvoice)) {
            return res.status(403).json({
                error: 1,
                message: `Anda tidak memiliki izin untuk membuat invoice untuk order ini.`
            });
        }

        // Cari order dengan order_id yang diberikan
        const order = await Order.findById(order_id);
        if (!order) {
            return res.status(404).json({
                error: 1,
                message: `Order dengan ID ${order_id} tidak ditemukan.`
            });
        }

        // Cari payment dengan payment_id yang diberikan
        const payment = await Payment.findById(payment_id);
        if (!payment) {
            return res.status(404).json({
                error: 1,
                message: `Payment dengan ID ${payment_id} tidak ditemukan.`
            });
        }

        // Buat objek invoice baru dengan menggunakan data order dan payment
        const newInvoice = new Invoice({
            order: {
                orderItems: order.orderItems,
                deliveryAddress: order.deliveryAddress, // Menambahkan alamat pengiriman ke objek invoice
                totalAmount: order.totalAmount,
                orderDate: order.orderDate
            },
            payment: payment.Name // Menambahkan informasi pembayaran ke dalam objek invoice
        });

        // Simpan invoice ke database
        await newInvoice.save();

        return res.status(201).json(newInvoice); // Mengembalikan response invoice yang baru dibuat
    } catch (error) {
        console.error('Error creating invoice:', error);
        return res.status(500).json({
            error: 1,
            message: `Terjadi kesalahan saat membuat invoice.`
        });
    }
};




const getInvoice = async (req, res, next) => {
    try {
        const invoices = await Invoice.find();

        const transformedInvoices = invoices.map(invoice => ({
            _id: invoice._id,
            order: {
                orderItems: invoice.order.orderItems.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    _id: item._id
                })),
                deliveryAddress: invoice.order.deliveryAddress,
                deliveryFee: invoice.order.deliveryFee,
                totalProductPrice: invoice.order.totalProductPrice,
                totalAmount: invoice.order.totalAmount,
                payment: invoice.order.payment,
                orderDate: invoice.order.orderDate
            }
        }));

        return res.status(200).json(transformedInvoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return res.status(500).json({
            error: 1,
            message: `Terjadi kesalahan saat mengambil data invoice.`
        });
    }
};


// Fungsi untuk menghapus invoice berdasarkan ID
const deleteInvoice = async (req, res, next) => {
    try {
        const invoiceId = req.params.id;
        
        // Hapus invoice berdasarkan ID
        const deletedInvoice = await Invoice.findByIdAndDelete(invoiceId);
        
        if (!deletedInvoice) {
            return res.status(404).json({
                error: 1,
                message: `Invoice dengan ID ${invoiceId} tidak ditemukan.`
            });
        }

        return res.status(200).json({
            message: `Invoice dengan ID ${invoiceId} berhasil dihapus.`
        });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        return res.status(500).json({
            error: 1,
            message: `Terjadi kesalahan saat menghapus invoice.`
        });
    }
};




const getIdinvoice = async (req, res, next) => {
    try {
        const invoiceId = req.params.id;
        const invoice = await Invoice.findById(invoiceId);
        
        if (!invoice) {
            return res.status(404).json({
                error: 1,
                message: `Invoice dengan ID ${invoiceId} tidak ditemukan.`
            });
        }

        // Generate PDF using PDFKit
        const doc = new PDFDocument();
        const pdfBuffer = await generatePDF(doc, invoice);

        // Set headers to indicate PDF content
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="invoice_${invoiceId}.pdf"`);
        
        // Send PDF buffer as response
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error fetching invoice by ID:', error);
        res.status(500).json({
            error: true,
            message: `Terjadi kesalahan saat mengambil invoice dengan ID ${req.params.id}.`
        });
    }
};



const generatePDF = async (doc, invoice) => {
    // Mulai dokumen PDF
    doc.font('Times-Roman').fontSize(20);

    doc.text(`Razz Coffee`, { align: 'center' });
    doc.text(`Jln Singa`, { align: 'center' });
    doc.text(`Kota Pematang Siantar`, { align: 'center' });
    doc.text(`----------------------------------------------------------------------`);
    doc.text('Order Items:');
    invoice.order.orderItems.forEach(item => {
        doc.text(` ${item.name}     Price: ${item.price}        Quantity: ${item.quantity}`);
    });
    doc.text(`----------------------------------------------------------------------`);
    doc.text(` Payment Method: ${invoice.payment}`);
    doc.text(`----------------------------------------------------------------------`);
    doc.text(` Total Amount: ${invoice.order.totalAmount}`);
    doc.text(`----------------------------------------------------------------------`);
    doc.text(`Terima Kasih `, { align: 'center' });
    doc.text(`Tagihan `, { align: 'center' });
    doc.text(`----------------------------------------------------------------------`);
    doc.text(` ${invoice.order.orderDate}`, { align: 'center' });

    // Selesai membuat dokumen PDF
    doc.end();

    // Mengembalikan dokumen PDF dalam bentuk base64
    return new Promise((resolve, reject) => {
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(buffers);
            const base64 = pdfBuffer.toString('base64');
            resolve(base64);
        });
        doc.on('error', reject);
    });
};


module.exports = { createInvoice, getInvoice, deleteInvoice ,getIdinvoice};


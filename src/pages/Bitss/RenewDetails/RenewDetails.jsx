import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  CheckCircle,
  Calendar,
  CreditCard,
  Globe,
  User,
  Mail,
  MapPin,
  Package,
  Key,
  Clock,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import { useParams } from "react-router";

export default function RenewDetails() {
  const { invoiceId } = useParams();
  const { user } = useAuth();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await fetch(
          `https://backend.bitss.one/api/v1/orders/order/show/renew/invoice?invoice_id=${invoiceId}`,
          { headers: { Authorization: `Bearer ${user}` } }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch invoice data");
        }

        const result = await response.json();
        setInvoiceData(result.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount, currency) => {
    return `${currency} ${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">
            Loading invoice details...
          </p>
        </div>
      </div>
    );
  }

  if (error && !invoiceData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Error Loading Invoice
          </h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const invoice = invoiceData.invoice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl  p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center ">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                  Invoice Details
                </h1>
                <p className="text-slate-500 mt-1">
                  Order #{invoice.order.order_number}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Payment Status
                </span>
              </div>
              <p className="text-lg font-bold text-green-800 capitalize">
                {invoice.paid ? "Paid" : "Unpaid"}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  Payment Method
                </span>
              </div>
              <p className="text-lg font-bold text-blue-800 capitalize">
                {invoice.payment_type}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  Issue Date
                </span>
              </div>
              <p className="text-sm font-bold text-purple-800">
                {formatDate(invoice.issued_at)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">
                  Total Amount
                </span>
              </div>
              <p className="text-lg font-bold text-orange-800">
                {formatCurrency(invoice.totalAmount, invoice.currency)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Details */}
            <div className="bg-white rounded-2xl  p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Product Information
                </h2>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 mb-4">
                <h3 className="text-lg font-bold text-slate-800 mb-3">
                  {invoice.orderProduct.product.name}
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Period</p>
                    <p className="font-semibold text-slate-700">
                      {invoice.orderProduct.period} months
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Price</p>
                    <p className="font-semibold text-slate-700">
                      ${invoice.orderProduct.price}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-600">
                    {formatDate(invoice.orderProduct.start_date)} -{" "}
                    {formatDate(invoice.orderProduct.end_date)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">
                  Features Included:
                </h4>
                {invoice.orderProduct.product.product_details.map(
                  (detail, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-600">{detail}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Access Credentials */}
            <div className="bg-white rounded-2xl  p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Key className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Access Credentials
                </h2>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <label className="text-xs font-medium text-slate-500 mb-2 block">
                    Username
                  </label>
                  <p className="font-mono text-sm font-semibold text-slate-800">
                    {invoice.orderProduct.product_key[0].username}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <label className="text-xs font-medium text-slate-500 mb-2 block">
                    Security Key
                  </label>
                  <p className="font-mono text-xs break-all text-slate-800 bg-white p-3 rounded-lg border border-slate-200">
                    {invoice.orderProduct.product_key[0].security_key}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Customer Details */}
            <div className="bg-white rounded-2xl  p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Customer Info
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Name</p>
                    <p className="font-semibold text-slate-800">
                      {invoice.user.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="font-medium text-slate-800 break-all">
                      {invoice.user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Personal Email</p>
                    <p className="font-medium text-slate-800 break-all">
                      {invoice.user.personal_email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Address</p>
                    <p className="font-medium text-slate-800">
                      {invoice.user.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-2xl  p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Order Details
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">Domain</span>
                  <span className="font-semibold text-slate-800">
                    {invoice.order.domain}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">Country</span>
                  <span className="font-semibold text-slate-800">
                    {invoice.order.country}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">Status</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold capitalize">
                    {invoice.order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">Currency Rate</span>
                  <span className="font-semibold text-slate-800">
                    {invoiceData.rateUsed}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl  p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">Subtotal (USD)</span>
                  <span className="font-semibold">
                    ${invoiceData.totalPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">Currency Rate</span>
                  <span className="font-semibold">{invoiceData.rateUsed}</span>
                </div>
                <div className="border-t border-indigo-400 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">
                      Total ({invoice.currency})
                    </span>
                    <span className="text-2xl font-bold">
                      {formatCurrency(invoice.totalAmount, invoice.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

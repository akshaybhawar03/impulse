"use client";

import { useState } from "react";
import { FaDownload, FaEye, FaSearch } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import QRCode from "react-qr-code";

const dummyReports = [
  {
    id: "RPT001",
    patient: "Tushar",
    test: "Blood Sugar",
    date: "2025-09-25",
    status: "Completed",
    file: "/reports/blood-sugar.pdf",
    doctorNote: "Blood sugar is slightly high, consider regular exercise.",
    data: [
      { date: "Jan", value: 110 },
      { date: "Feb", value: 125 },
      { date: "Mar", value: 140 },
      { date: "Apr", value: 118 },
    ],
  },
  {
    id: "RPT002",
    patient: "Tushar",
    test: "Cholesterol",
    date: "2025-09-27",
    status: "In Process",
    file: "",
    doctorNote: "",
    data: [],
  },
];

export default function ReportSection() {
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const filteredReports = dummyReports.filter(
    (r) =>
      r.patient.toLowerCase().includes(search.toLowerCase()) ||
      r.test.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">My Reports</h2>

      {/* Search */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, test, or ID..."
          className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FaSearch className="text-gray-500" />
      </div>

      {/* Reports Table */}
      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="p-3">Report ID</th>
              <th className="p-3">Test</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr
                key={report.id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="p-3">{report.id}</td>
                <td className="p-3">{report.test}</td>
                <td className="p-3">{report.date}</td>
                <td
                  className={`p-3 font-medium ${
                    report.status === "Completed"
                      ? "text-green-600"
                      : report.status === "In Process"
                      ? "text-orange-500"
                      : "text-gray-500"
                  }`}
                >
                  {report.status}
                </td>
                <td className="p-3 flex gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => setSelectedReport(report)}
                  >
                    <FaEye />
                  </button>
                  {report.file && (
                    <a
                      href={report.file}
                      download
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaDownload />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-3">
              {selectedReport.test} Report
            </h3>
            <p>
              <strong>Patient:</strong> {selectedReport.patient}
            </p>
            <p>
              <strong>Date:</strong> {selectedReport.date}
            </p>
            <p>
              <strong>Status:</strong> {selectedReport.status}
            </p>
            {selectedReport.doctorNote && (
              <p className="mt-2 p-2 bg-yellow-100 rounded">
                <strong>Doctor’s Note:</strong> {selectedReport.doctorNote}
              </p>
            )}

            {/* Graph Section */}
            {selectedReport.data.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Result Trend</h4>
                <LineChart
                  width={450}
                  height={250}
                  data={selectedReport.data}
                  className="mx-auto"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    strokeWidth={2}
                  />
                </LineChart>
              </div>
            )}

            {/* QR Code */}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Verify Report</h4>
              <QRCode value={`https://yourlab.com/verify/${selectedReport.id}`} />
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </button>
              {selectedReport.file && (
                <a
                  href={selectedReport.file}
                  download
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Download PDF
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const ResponseComponent = ({ response }) => {
  if (!response) return null;

  const {
    compilationErrors,
    deprecatedMethods,
    deprecatedApisPackages,
    outdatedDependencies,
  } = response;

  const downloadPDF = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();
  
    // Add Deprecated Methods table if there are entries
    if (Object.keys(deprecatedMethods).length > 0) {
      // Set title for Deprecated Methods section
      doc.text("Deprecated Methods", 14, 20);
  
      // Format data correctly for autoTable
      const methods = Object.entries(deprecatedMethods).map(([filePath, methods]) => [
        filePath,
        methods.map(method => method.error ? method.error : method).join(", ")
      ]);
  
      // Add table using autoTable plugin
      doc.autoTable({
        head: [["File Path", "Deprecated Methods"]],
        body: methods,
        startY: 30,
      });
    }
  
    // Save the document with the given name
    doc.save("report.pdf");
  };

  const downloadExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Add Compilation Errors sheet
    if (compilationErrors.length > 0) {
      const wsData = [
        ["File", "Error"],
        ...compilationErrors.map((error) => [
          error.error.split(":")[0],
          error.error,
        ]),
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Compilation Errors");
    }

    // Add Deprecated Methods sheet
    if (Object.keys(deprecatedMethods).length > 0) {
      const wsData = [
        ["File Path", "Deprecated Methods"],
        ...Object.entries(deprecatedMethods).map(([filePath, methods]) => [
          filePath,
          methods
            .map((method) =>
              method.error
                ? method.error
                : `${method.methodName}: ${method.replacement}`
            )
            .join(", "),
        ]),
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Deprecated Methods");
    }

    // Add Deprecated APIs Packages sheet
    if (Object.keys(deprecatedApisPackages).length > 0) {
      const wsData = [
        ["File Path", "Deprecated APIs"],
        ...Object.entries(deprecatedApisPackages).map(([filePath, apis]) => [
          filePath,
          apis.join(", "),
        ]),
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Deprecated APIs Packages"
      );
    }

    // Add Outdated Dependencies sheet
    if (outdatedDependencies.length > 0) {
      const wsData = [
        ["Outdated Dependencies"],
        ...outdatedDependencies.map((dependency) => [dependency]),
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Outdated Dependencies"
      );
    }

    XLSX.writeFile(workbook, "report.xlsx");
  };

  return (
    <div className="m-6">
      <h2 className="text-lg font-semibold mb-4">
        Here's the detailed output for your uploaded file!
      </h2>

      {/* Buttons for download */}
      <div className="mb-4">
        <button
          onClick={downloadPDF}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Download as PDF
        </button>
        <button
          onClick={downloadExcel}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Download as Excel
        </button>
      </div>

      {/* Compilation Errors Table */}
      {compilationErrors.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Compilation Errors</h3>
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-orange-900 text-white">
                <th className="border px-4 py-2 text-left">File</th>
                <th className="border px-4 py-2 text-left">Error</th>
              </tr>
            </thead>
            <tbody>
              {compilationErrors.map((error, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-sky-100" : "bg-white"}
                >
                  <td className="border px-4 py-2">
                    {error.error.split(":")[0]}
                  </td>
                  <td className="border px-4 py-2">{error.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Deprecated Methods Table */}
      {Object.keys(deprecatedMethods).length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Deprecated Methods</h3>
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-orange-900 text-white">
                <th className="border px-4 py-2 text-left">File Path</th>
                <th className="border px-4 py-2 text-left">
                  Deprecated Methods
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(deprecatedMethods).map(
                ([filePath, methods], index) => (
                  <tr
                    key={filePath}
                    className={index % 2 === 0 ? "bg-sky-100" : "bg-white"}
                  >
                    <td className="border px-4 py-2">{filePath}</td>
                    <td
                      className="border px-4 py-2"
                      style={{
                        backgroundColor:
                          methods.length > 0 ? "lightorange" : "",
                      }}
                    >
                      {methods.length > 0 ? (
                        <ul className="list-disc pl-4">
                          {methods.map((method, idx) => (
                            <li key={idx}>
                              {method.error
                                ? method.error
                                : `${method.methodName}: ${method.replacement}`}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No deprecated methods</p>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Deprecated APIs Packages Table */}
      {Object.keys(deprecatedApisPackages).length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">
            Deprecated APIs Packages
          </h3>
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-orange-900 text-white">
                <th className="border px-4 py-2 text-left">File Path</th>
                <th className="border px-4 py-2 text-left">Deprecated APIs</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(deprecatedApisPackages).map(
                ([filePath, apis], index) => (
                  <tr
                    key={filePath}
                    className={index % 2 === 0 ? "bg-sky-100" : "bg-white"}
                  >
                    <td className="border px-4 py-2">{filePath}</td>

                    <td className="border px-4 py-2">
                      {apis.map((api, idx) => (
                        <p key={idx}>{api}</p>
                      ))}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Outdated Dependencies Table */}
      {outdatedDependencies.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Outdated Dependencies</h3>
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-orange-900 text-white">
                <th className="border px-4 py-2 text-left">
                  Outdated Dependencies
                </th>
              </tr>
            </thead>
            <tbody>
              {outdatedDependencies.map((dependency, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-sky-100" : "bg-white"}
                >
                  <td className="border px-4 py-2">{dependency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResponseComponent;

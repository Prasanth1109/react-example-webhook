"use client"

import { useState } from "react";

const schemaOptions = [
  { label: "First Name", value: "first_name", color: "bg-green-500" },
  { label: "Last Name", value: "last_name", color: "bg-green-500" },
  { label: "Gender", value: "gender", color: "bg-green-500" },
  { label: "Age", value: "age", color: "bg-green-500" },
  { label: "Account Name", value: "account_name", color: "bg-red-500" },
  { label: "City", value: "city", color: "bg-red-500" },
  { label: "State", value: "state", color: "bg-red-500" },
];

type Schema = {
  id: number;
  value: string;
  label: string;
  color: string;
};

const SaveSegmentDrawer = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<string>("");

  const addSchema = () => {
    const option = schemaOptions.find((opt) => opt.value === selectedSchema);
    if (option) {
      setSchemas([...schemas, { id: Date.now(), ...option }]);
      setSelectedSchema("");
    }
  };

  const removeSchema = (id: number) => {
    setSchemas(schemas.filter((schema) => schema.id !== id));
  };

  const drawerClose = () => {
    setDrawerOpen(false); 
    setSegmentName('');
    setSchemas([]);
    setSelectedSchema('');
  }

  const saveSegment = () => {
    const formattedData = {
      segment_name: segmentName,
      schema: schemas.map((s) => ({ [s.value]: s.label })),
    };
    console.log("Sending data to server:", JSON.stringify(formattedData, null, 2));
    fetch("https://webhook.site/9d7e390e-867a-4fc4-b664-5c063d7e40fc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedData),
    }).then((response) => {
      if (response.ok) alert("Segment saved successfully!");
      else alert("Failed to save segment.");
    });
    drawerClose(); 
  };

  const availableOptions = schemaOptions.filter(
    (opt) => !schemas.find((schema) => schema.value === opt.value)
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <button
        onClick={() => setDrawerOpen(true)}
        className="bg-teal-600 text-white px-4 py-2 rounded-md"
      >
        Save Segment
      </button>

      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={drawerClose}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform ${drawerOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300`}
      >
        <h2 className="text-xl font-semibold mb-2 bg-[cadetblue] py-4 px-5"><i onClick={() => setDrawerOpen(false)} className="fa-solid fa-chevron-left mr-2 cursor-pointer"></i>Saving Segment</h2>
        <div className="p-6">
          <p className="text-gray-600 font-semibold text-sm mb-4">
            Enter the Name of the Segment
          </p>
          <input
            type="text"
            placeholder="Name of the Segment"
            className="w-full p-2 border border-gray-300 rounded-md mb-4 text-zinc-800 text-sm"
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
          />
          <p className="text-gray-600 text-sm mb-6">
            To save your segment, you need to add the schemas to build the query
          </p>
          <div className="flex items-center justify-end mb-2 text-gray-600 text-sm">
            <span className="flex items-center gap-2 mr-4">
              <span className="bg-green-500 w-2 h-2 rounded-full"></span> User Traits
            </span>
            <span className="flex items-center gap-2">
              <span className="bg-red-500 w-2 h-2 rounded-full"></span> Group Traits
            </span>
          </div>

          {schemas.length > 0 && (<div className="mb-4 border border-blue-200 rounded-lg p-4 bg-blue-50">
            {schemas.map((schema) => (
              <div key={schema.id} className="flex items-center mb-2">
                <span className={`${schema.color} w-2 h-2 rounded-full mr-2`}></span>
                <select
                  className='w-full p-2 border border-gray-300 rounded-md text-gray-500 text-sm'
                  value={schema.value}
                  onChange={(e) => {
                    const option = schemaOptions.find((opt) => opt.value === e.target.value);
                    if (option) {
                      setSchemas(
                        schemas.map((s) =>
                          s.id === schema.id ? { ...s, value: option.value, label: option.label } : s
                        )
                      );
                    }
                  }}
                >
                  <option value="">{schema.label}</option>
                  {availableOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeSchema(schema.id)}
                  className="ml-2 text-gray-500 rounded-md bg-cyan-100 px-2"
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
              </div>
            ))}
          </div>)}

          <div className="flex items-center mb-4">
            <select
              className="w-full px-1 py-2 border border-gray-300 rounded-md text-gray-500 text-sm"
              value={selectedSchema}
              onChange={(e) => setSelectedSchema(e.target.value)}
            >
              <option value="" disabled hidden>Add schema to segment</option>
              {availableOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={addSchema}
            className="text-teal-700 text-sm font-semibold underline mb-4"
          >
            + Add new schema
          </button>
        </div>
        <div className="absolute bottom-0 bg-slate-100 p-4 w-full">
          <button
            onClick={saveSegment}
            className="bg-teal-600 text-white px-4 py-2 rounded-md mr-2"
          >
            Save the Segment
          </button>
          <button
            onClick={drawerClose}
            className="bg-white text-red-500 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveSegmentDrawer;

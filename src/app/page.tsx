"use client"

import React, { useState } from 'react';

// Define the types for schema options
interface SchemaOption {
  label: string;
  value: string;
}

// Schema options
const schemaOptions: SchemaOption[] = [
  { label: 'First Name', value: 'first_name' },
  { label: 'Last Name', value: 'last_name' },
  { label: 'Gender', value: 'gender' },
  { label: 'Age', value: 'age' },
  { label: 'Account Name', value: 'account_name' },
  { label: 'City', value: 'city' },
  { label: 'State', value: 'state' }
];

const Home: React.FC = () => {
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [segmentName, setSegmentName] = useState<string>('');
  const [selectedSchemas, setSelectedSchemas] = useState<SchemaOption[]>([]);
  const [availableSchemas, setAvailableSchemas] = useState<SchemaOption[]>([...schemaOptions]);

  const handleSaveSegment = (): void => {
    setDrawerOpen(true); // Open the drawer when "Save Segment" is clicked
  };

  const handleAddNewSchema = (): void => {
    if (availableSchemas.length > 0) {
      setSelectedSchemas([...selectedSchemas, availableSchemas[0]]);
      setAvailableSchemas(availableSchemas.slice(1));
    }
  };

  const handleSchemaChange = (index: number, newSchema: SchemaOption): void => {
    const newSelectedSchemas = selectedSchemas.map((schema, i) =>
      i === index ? newSchema : schema
    );
    setSelectedSchemas(newSelectedSchemas);
  };

  const handleSubmit = (): void => {
    const schema = selectedSchemas.map(schema => ({
      [schema.value]: schema.label
    }));

    const data = {
      segment_name: segmentName,
      schema
    };

    // Send data to webhook
    fetch('https://webhook.site/cb692837-8144-4691-acd7-59aa5840fe93', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    setDrawerOpen(false); // Close the drawer after saving
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <button
        className="px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        onClick={handleSaveSegment}
      >
        Save Segment
      </button>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 w-96 h-full bg-white shadow-lg transform transition-transform ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Save Segment</h3>

          <input
            type="text"
            placeholder="Enter segment name"
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
          />

          <div className="bg-blue-100 p-4 mb-4 rounded-md">
            {selectedSchemas.map((schema, index) => (
              <select
                key={index}
                value={schema.value}
                onChange={(e) =>
                  handleSchemaChange(index, schemaOptions.find(opt => opt.value === e.target.value)!)
                }
                className="w-full p-2 mb-2 border rounded-md"
              >
                {schemaOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
          </div>

          <select
            onChange={handleAddNewSchema}
            className="w-full p-2 mb-4 border rounded-md"
          >
            {availableSchemas.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 mr-2"
            onClick={handleAddNewSchema}
          >
            +Add new schema
          </button>

          <button
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Save Segment
          </button>

          <button
            className="mt-4 text-red-500"
            onClick={() => setDrawerOpen(false)}  // Close drawer button
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

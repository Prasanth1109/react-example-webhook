"use client"

import React, { useState } from 'react';

// Define types for schema options
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
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);
  const [segmentName, setSegmentName] = useState<string>('');
  const [selectedSchemas, setSelectedSchemas] = useState<SchemaOption[]>([]);
  const [availableSchemas, setAvailableSchemas] = useState<SchemaOption[]>([...schemaOptions]);

  const handleSaveSegment = (): void => {
    setPopupOpen(true);
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

    // Send data to webhook (replace with your actual webhook URL)
    fetch('https://webhook.site/cb692837-8144-4691-acd7-59aa5840fe93', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    setPopupOpen(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <button
        className="px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        onClick={handleSaveSegment}
      >
        Save Segment
      </button>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

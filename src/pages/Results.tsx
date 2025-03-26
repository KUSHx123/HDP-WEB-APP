import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { PredictionResult } from '../types';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Mock prediction result (replace with actual prediction logic)
  const predictionResult: PredictionResult = {
    probability: 0.75,
    metrics: {
      precision: 0.82,
      recall: 0.78,
      f1Score: 0.80
    }
  };

  const metricsData = [
    { name: 'Precision', value: predictionResult.metrics.precision },
    { name: 'Recall', value: predictionResult.metrics.recall },
    { name: 'F1 Score', value: predictionResult.metrics.f1Score }
  ];

  const getRiskLevel = (probability: number) => {
    if (probability >= 0.7) return 'High';
    if (probability >= 0.4) return 'Moderate';
    return 'Low';
  };

  const getRiskColor = (probability: number) => {
    if (probability >= 0.7) return 'text-red-600';
    if (probability >= 0.4) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Prediction Results</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Probability Display */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">
                    {(predictionResult.probability * 100).toFixed(1)}%
                  </div>
                  <div className={`text-xl font-semibold ${getRiskColor(predictionResult.probability)}`}>
                    {getRiskLevel(predictionResult.probability)} Risk
                  </div>
                </div>
              </div>

              {/* Metrics Chart */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Metrics</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metricsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 1]} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">What does this mean?</h3>
              <p className="text-blue-800">
                Based on the provided data, our model predicts a {(predictionResult.probability * 100).toFixed(1)}% 
                probability of heart disease risk. This prediction is based on multiple factors including age, 
                gender, cholesterol levels, and other health metrics. Please consult with a healthcare professional 
                for a thorough evaluation and personalized medical advice.
              </p>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => navigate('/predict')}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Make Another Prediction
              </button>
              <button
                onClick={() => window.print()}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Print Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
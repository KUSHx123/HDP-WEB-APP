import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePredictions } from '../hooks/usePredictions';

interface PredictionFormData {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
}

const Predict = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { savePrediction } = usePredictions(user?.id || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PredictionFormData>({
    age: 0,
    sex: 0,
    cp: 0,
    trestbps: 0,
    chol: 0,
    fbs: 0,
    restecg: 0,
    thalach: 0,
    exang: 0,
    oldpeak: 0,
    slope: 0,
    ca: 0,
    thal: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: number;

    // Handle oldpeak separately as it allows decimal values
    if (name === 'oldpeak') {
      parsedValue = parseFloat(value) || 0;
    } else {
      parsedValue = parseInt(value) || 0;
    }

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const validateForm = () => {
    if (formData.age <= 0) return 'Age must be greater than 0';
    if (formData.sex < 0 || formData.sex > 1) return 'Sex must be 0 or 1';
    if (formData.cp < 0 || formData.cp > 3) return 'CP must be between 0 and 3';
    if (formData.trestbps <= 0) return 'Resting blood pressure must be greater than 0';
    if (formData.chol <= 0) return 'Cholesterol must be greater than 0';
    if (formData.fbs < 0 || formData.fbs > 1) return 'FBS must be 0 or 1';
    if (formData.restecg < 0 || formData.restecg > 2) return 'RestECG must be between 0 and 2';
    if (formData.thalach <= 0) return 'Maximum heart rate must be greater than 0';
    if (formData.exang < 0 || formData.exang > 1) return 'Exercise induced angina must be 0 or 1';
    if (formData.oldpeak < 0) return 'ST depression must be non-negative';
    if (formData.slope < 0 || formData.slope > 2) return 'Slope must be between 0 and 2';
    if (formData.ca < 0 || formData.ca > 3) return 'Number of vessels must be between 0 and 3';
    if (formData.thal < 0 || formData.thal > 3) return 'Thal must be between 0 and 3';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      // Calculate risk level (mock implementation)
      const riskLevel = Math.random(); // Replace with actual prediction logic

      const { error: saveError } = await savePrediction({
        ...formData,
        risk_level: riskLevel
      });
      
      if (saveError) {
        throw new Error(saveError);
      }

      navigate('/results', { 
        state: { 
          predictionData: {
            ...formData,
            probability: riskLevel
          }
        } 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save prediction');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Heart Disease Prediction Tool</h2>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
                  Sex (0 = female, 1 = male)
                </label>
                <input
                  type="number"
                  id="sex"
                  name="sex"
                  min="0"
                  max="1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.sex}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="cp" className="block text-sm font-medium text-gray-700">
                  Chest Pain Type (0-3)
                </label>
                <input
                  type="number"
                  id="cp"
                  name="cp"
                  min="0"
                  max="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.cp}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="trestbps" className="block text-sm font-medium text-gray-700">
                  Resting Blood Pressure
                </label>
                <input
                  type="number"
                  id="trestbps"
                  name="trestbps"
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.trestbps}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="chol" className="block text-sm font-medium text-gray-700">
                  Cholesterol
                </label>
                <input
                  type="number"
                  id="chol"
                  name="chol"
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.chol}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="fbs" className="block text-sm font-medium text-gray-700">
                  Fasting Blood Sugar (0 = false, 1 = true)
                </label>
                <input
                  type="number"
                  id="fbs"
                  name="fbs"
                  min="0"
                  max="1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.fbs}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="restecg" className="block text-sm font-medium text-gray-700">
                  Resting ECG (0-2)
                </label>
                <input
                  type="number"
                  id="restecg"
                  name="restecg"
                  min="0"
                  max="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.restecg}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="thalach" className="block text-sm font-medium text-gray-700">
                  Maximum Heart Rate
                </label>
                <input
                  type="number"
                  id="thalach"
                  name="thalach"
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.thalach}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="exang" className="block text-sm font-medium text-gray-700">
                  Exercise Induced Angina (0 = no, 1 = yes)
                </label>
                <input
                  type="number"
                  id="exang"
                  name="exang"
                  min="0"
                  max="1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.exang}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="oldpeak" className="block text-sm font-medium text-gray-700">
                  ST Depression (oldpeak)
                </label>
                <input
                  type="number"
                  id="oldpeak"
                  name="oldpeak"
                  min="0"
                  step="0.1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.oldpeak}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="slope" className="block text-sm font-medium text-gray-700">
                  ST Slope (0-2)
                </label>
                <input
                  type="number"
                  id="slope"
                  name="slope"
                  min="0"
                  max="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.slope}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="ca" className="block text-sm font-medium text-gray-700">
                  Number of Major Vessels (0-3)
                </label>
                <input
                  type="number"
                  id="ca"
                  name="ca"
                  min="0"
                  max="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.ca}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="thal" className="block text-sm font-medium text-gray-700">
                  Thalassemia (0-3)
                </label>
                <input
                  type="number"
                  id="thal"
                  name="thal"
                  min="0"
                  max="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.thal}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Get Prediction'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Predict;
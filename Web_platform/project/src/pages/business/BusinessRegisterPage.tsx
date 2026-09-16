import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Loader2, MapPin, Store } from 'lucide-react';
import { businessApi } from '@/api/business';
import { useAuth } from '@/hooks/useAuth';

export function BusinessRegisterPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [form, setForm] = useState({
    name: '',
    description: '',
    phoneNumber: '',
    email: '',
    addressLine: '',
    city: '',
    state: '',
    latitude: '',
    longitude: '',
    minimumOrderAmount: '0',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const latitude = Number(form.latitude);
      const longitude = Number(form.longitude);
      const minimumOrderAmount = Number(form.minimumOrderAmount);

      if (!form.name.trim()) {
        throw new Error('Business name is required.');
      }
      if (!form.addressLine.trim()) {
        throw new Error('Business address is required.');
      }
      if (!form.city.trim()) {
        throw new Error('City is required.');
      }
      if (!form.state.trim()) {
        throw new Error('State is required.');
      }
      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        throw new Error('Please provide valid latitude and longitude coordinates.');
      }
      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        throw new Error('Latitude and longitude must be within valid geographic ranges.');
      }
      if (minimumOrderAmount < 0 || Number.isNaN(minimumOrderAmount)) {
        throw new Error('Minimum order amount must be zero or greater.');
      }
      if (!form.email.trim() && !form.phoneNumber.trim()) {
        throw new Error('Provide either an email address or phone number for the business.');
      }

      await businessApi.register({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        phoneNumber: form.phoneNumber.trim() || undefined,
        email: form.email.trim() || undefined,
        addressLine: form.addressLine.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        latitude,
        longitude,
        minimumOrderAmount,
      });

      await refreshUser();
      navigate('/business');
    } catch (err: any) {
      setError(err?.message || 'Business registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Register Your Business</h1>
          <p className="text-sm text-gray-500">Create the business profile that will appear in the SQUADLINK marketplace.</p>
        </div>
        <Link to="/dashboard" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
          Back to dashboard
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl bg-primary-50 p-4 text-sm text-primary-800">
            <div className="flex items-center gap-2 font-semibold">
              <Store className="h-4 w-4" />
              Business onboarding follows the live backend contract.
            </div>
          </div>

          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
              Business name
            </label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              placeholder="Green Basket Market"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              placeholder="Describe your store and products."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="phoneNumber" className="mb-1 block text-sm font-medium text-gray-700">
                Phone number
              </label>
              <input
                id="phoneNumber"
                value={form.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                placeholder="+1 555 123 4567"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                placeholder="hello@yourstore.com"
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="h-4 w-4 text-gray-400" />
              Address
            </div>
            <input
              value={form.addressLine}
              onChange={(e) => handleChange('addressLine', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="mb-1 block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                id="city"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                placeholder="Seattle"
              />
            </div>
            <div>
              <label htmlFor="state" className="mb-1 block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                id="state"
                value={form.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                placeholder="WA"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="latitude" className="mb-1 block text-sm font-medium text-gray-700">
                Latitude
              </label>
              <input
                id="latitude"
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => handleChange('latitude', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                placeholder="47.6062"
              />
            </div>
            <div>
              <label htmlFor="longitude" className="mb-1 block text-sm font-medium text-gray-700">
                Longitude
              </label>
              <input
                id="longitude"
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => handleChange('longitude', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                placeholder="-122.3321"
              />
            </div>
          </div>

          <div>
            <label htmlFor="minimumOrderAmount" className="mb-1 block text-sm font-medium text-gray-700">
              Minimum order amount
            </label>
            <input
              id="minimumOrderAmount"
              type="number"
              min="0"
              step="1"
              value={form.minimumOrderAmount}
              onChange={(e) => handleChange('minimumOrderAmount', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              placeholder="0"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Building2 className="h-4 w-4" />}
            {isLoading ? 'Registering business...' : 'Create business'}
          </button>
        </form>
      </div>
    </div>
  );
}

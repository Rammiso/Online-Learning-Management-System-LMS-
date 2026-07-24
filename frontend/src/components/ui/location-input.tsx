import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { apiUrl } from '@/lib/api';

const COMMON_COUNTRIES = [
  'Afghanistan', 'Algeria', 'Bahrain', 'Bangladesh', 'Canada', 'Djibouti',
  'Egypt', 'Eritrea', 'Ethiopia', 'France', 'Germany', 'India',
  'Indonesia', 'Iran', 'Iraq', 'Italy', 'Japan', 'Jordan',
  'Kenya', 'Kuwait', 'Lebanon', 'Libya', 'Malaysia', 'Maldives',
  'Mali', 'Mauritania', 'Morocco', 'Netherlands', 'Niger', 'Nigeria',
  'Oman', 'Pakistan', 'Palestine State', 'Qatar', 'Saudi Arabia',
  'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Sweden',
  'Syria', 'Tanzania', 'Tunisia', 'Turkey', 'Uganda',
  'United Arab Emirates', 'United Kingdom', 'United States of America',
  'Yemen',
];

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CountryInput({ value, onChange, placeholder = 'Type a country...', className, disabled }: LocationInputProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(value || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => { setInput(value || ''); }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input || input.length < 1) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(apiUrl(`/auth/countries?q=${encodeURIComponent(input)}`));
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.length > 0 ? data : COMMON_COUNTRIES.filter(
            c => c.toLowerCase().includes(input.toLowerCase()) && c.toLowerCase() !== input.toLowerCase()
          ).slice(0, 10));
        } else {
          setSuggestions(COMMON_COUNTRIES.filter(
            c => c.toLowerCase().includes(input.toLowerCase()) && c.toLowerCase() !== input.toLowerCase()
          ).slice(0, 10));
        }
      } catch {
        setSuggestions(COMMON_COUNTRIES.filter(
          c => c.toLowerCase().includes(input.toLowerCase()) && c.toLowerCase() !== input.toLowerCase()
        ).slice(0, 10));
      } finally { setLoading(false); }
    }, 300);
  }, [input]);

  const display = open && suggestions.length > 0 && input ? suggestions : [];

  return (
    <div ref={ref} className="relative">
      <Input
        value={input}
        onChange={e => { setInput(e.target.value); onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        autoComplete="off"
      />
      {loading && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />}
      {display.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-xl border border-border bg-background shadow-lg">
          {display.map(c => (
            <button
              key={c}
              type="button"
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors cursor-pointer"
              onClick={() => { setInput(c); onChange(c); setOpen(false); }}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface CityInputProps extends LocationInputProps {
  country: string;
}

export function CityInput({ value, onChange, placeholder = 'Type a city...', className, disabled, country }: CityInputProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(value || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => { setInput(value || ''); }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!country) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ country, q: input });
        const res = await fetch(apiUrl(`/auth/cities?${params}`));
        if (res.ok) { const data = await res.json(); setSuggestions(data); }
      } catch {} finally { setLoading(false); }
    }, 300);
  }, [input, country]);

  const display = open && suggestions.length > 0 && input ? suggestions : [];

  return (
    <div ref={ref} className="relative">
      <Input
        value={input}
        onChange={e => { setInput(e.target.value); onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={country ? placeholder : 'Select country first'}
        className={className}
        disabled={disabled || !country}
        autoComplete="off"
      />
      {loading && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />}
      {display.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-xl border border-border bg-background shadow-lg">
          {display.map(c => (
            <button
              key={c}
              type="button"
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors cursor-pointer"
              onClick={() => { setInput(c); onChange(c); setOpen(false); }}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
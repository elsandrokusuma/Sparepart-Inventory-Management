
"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface ClientFormattedDateProps {
  date: string | number | Date;
  format: string;
}

export function ClientFormattedDate({ date, format: formatStr }: ClientFormattedDateProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(format(new Date(date), formatStr));
  }, [date, formatStr]);

  if (!formattedDate) {
    return null; // or a loading skeleton
  }

  return <>{formattedDate}</>;
}

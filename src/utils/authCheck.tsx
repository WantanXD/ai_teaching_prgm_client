import React from 'react'
import { apiClient } from '@/lib/apiClient';

export async function authCheck(): Promise<Object> {
  const jwtToken = localStorage.getItem('jwtToken');
  if (jwtToken) {
    const response = await apiClient.post('/jwt/tokenVerification', {
      jwtToken,
    })
    if (response.data.isAuthenticated === true) {
      localStorage.setItem('jwtToken', response.data.jwtToken);
    }
    return response;
  }
  return {};
}
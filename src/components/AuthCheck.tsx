import React from 'react'
import { apiClient } from '@/lib/apiClient';

export const authCheck = async() => {
  const jwtToken = localStorage.getItem('jwtToken');
  if (jwtToken) {
    const response = await apiClient.post('/jwt/tokenVerification', {
      jwtToken,
    });
    return response;
  }else {
    return null;
  }
}

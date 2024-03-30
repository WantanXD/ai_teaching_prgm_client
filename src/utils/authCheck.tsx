import React from 'react'
import { apiClient } from '@/lib/apiClient';
import { authObj } from '@/utils/myObjects';

export async function authCheck(): Promise<authObj> {
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
  return {
    data: {
      isAuthenticated: false,  
    }
  };
}
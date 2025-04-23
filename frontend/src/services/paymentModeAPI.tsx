"use client";

// API service for payment modes

interface Category {
  name: string;
  type: string;
  color: string;
}

class PaymentModeAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  }

  // Get token from localStorage
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Create multiple payment modes at once
  async createPaymentModes(categories: Category[]): Promise<boolean> {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      // Create each payment mode
      const promises = categories.map(category => {
        return fetch(`${this.baseUrl}/payment-modes`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: category.name,
            type: category.type,
            color: category.color,
          }),
        });
      });

      // Wait for all promises to resolve
      const responses = await Promise.all(promises);
      
      // Check if all requests were successful
      const allSuccessful = responses.every(response => response.ok);
      
      return allSuccessful;
    } catch (error) {
      console.error('Error creating payment modes:', error);
      return false;
    }
  }

  // Get all payment modes
  async getPaymentModes(): Promise<any[]> {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(`${this.baseUrl}/payment-modes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment modes');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching payment modes:', error);
      return [];
    }
  }
}

// Create and export an instance
const paymentModeAPI = new PaymentModeAPI();
export default paymentModeAPI;
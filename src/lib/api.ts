export interface CheckoutItemPayload {
  productId: string;
  flavour: string;
  size: string;
  qty: number;
  variantId?: string;
}

export interface ShippingAddressPayload {
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface CreateCheckoutSessionResponse {
  orderId: string;
  orderNumber: string;
  razorpayOrderId: string;
  totalPaise: number;
  razorpayKeyId: string;
  currency?: string;
  checkoutUrl?: string; // fallback if needed
}

export interface VerifyRazorpayPayload {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export async function verifyRazorpayPaymentApi(
  payload: VerifyRazorpayPayload,
  token?: string
): Promise<{ success: boolean; message?: string; orderId: string }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/api/checkout/verify`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Payment verification failed');
  }

  return data;
}


export interface CreateCodOrderResponse {
  orderId: string;
  orderNumber: string;
  status: string;
  totalPaise: number;
}

export interface OrderDetailsResponse {
  order: {
    id: string;
    order_number: string;
    user_id: string | null;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: ShippingAddressPayload;
    subtotal_paise: number;
    discount_paise: number;
    shipping_paise: number;
    tax_paise: number;
    total_paise: number;
    coupon_code: string | null;
    currency: string;
    payment_method: 'stripe' | 'cod';
    status: string;
    payment_status: string;
    tracking_number: string | null;
    created_at: string;
  };
  items: Array<{
    id: string;
    product_id: string;
    product_name: string;
    product_brand: string;
    product_image: string;
    selected_flavour: string;
    selected_size: string;
    unit_price_paise: number;
    quantity: number;
    total_price_paise: number;
  }>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function createCheckoutSession(
  items: CheckoutItemPayload[],
  shippingAddress: ShippingAddressPayload,
  couponCode?: string,
  token?: string
): Promise<CreateCheckoutSessionResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/api/checkout/session`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      items,
      couponCode: couponCode || undefined,
      shippingAddress,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to initiate checkout');
  }

  return data as CreateCheckoutSessionResponse;
}

export async function createCodOrder(
  items: CheckoutItemPayload[],
  shippingAddress: ShippingAddressPayload,
  couponCode?: string,
  token?: string
): Promise<CreateCodOrderResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/api/orders/cod`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      items,
      couponCode: couponCode || undefined,
      shippingAddress,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to place Cash on Delivery order');
  }

  return data as CreateCodOrderResponse;
}

export async function fetchOrderById(
  orderId: string,
  token?: string
): Promise<OrderDetailsResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
    method: 'GET',
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch order details');
  }

  return data as OrderDetailsResponse;
}

export interface UploadMediaResponse {
  success: boolean;
  url: string;
  filePath: string;
  sizeBytes: number;
  mimeType: string;
}

/**
 * Upload an image to the backend which securely stores it in Supabase Storage
 */
export async function uploadProductImageApi(
  file: File,
  token?: string
): Promise<UploadMediaResponse> {
  // Convert File to base64
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/api/media/upload`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type || 'image/jpeg',
      base64Data,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload image to server');
  }

  return data as UploadMediaResponse;
}

/**
 * Create a new product via backend REST API (Admin)
 */
export async function createProductApi(
  productData: Record<string, any>,
  token?: string
): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers,
    body: JSON.stringify(productData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create product via API');
  }

  return data;
}

/**
 * Update an existing product via backend REST API (Admin)
 */
export async function updateProductApi(
  id: string,
  updates: Record<string, any>,
  token?: string
): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updates),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update product via API');
  }

  return data;
}

/**
 * Delete a product via backend REST API (Admin)
 */
export async function deleteProductApi(id: string, token?: string): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete product via API');
  }

  return data;
}

/**
 * Fetch all orders for admin review
 */
export async function fetchAdminOrdersApi(token?: string): Promise<{ success: boolean; orders: any[] }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/api/orders/admin/all`, {
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch admin orders');
  }

  return data;
}

/**
 * Update order status (confirmed, shipped, delivered)
 */
export async function updateOrderStatusApi(
  orderId: string,
  status: string,
  trackingNumber?: string,
  token?: string
): Promise<{ success: boolean; message: string; order: any }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/api/orders/admin/${orderId}/status`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status, trackingNumber }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update order status');
  }

  return data;
}



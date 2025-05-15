import CONFIG from "../config";

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  STORIES: `${CONFIG.BASE_URL}/stories`,

  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

// == Register == //
export async function register({ name, email, password }) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const responseJson = await response.json();
  return { ...responseJson, ok: response.ok };
}

// == Login == //
export async function login({ email, password }) {
  try {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: data.message || "Login gagal",
      };
    }

    return {
      error: false,
      loginResult: data.loginResult,
    };
  } catch (error) {
    return {
      error: true,
      message: "Terjadi kesalahan jaringan",
    };
  }
}

// == Get == //
export async function getStories(token) {
  try {
    const url = new URL(`${ENDPOINTS.STORIES}`);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: true,
        message: errorData.message || "Network error",
        listStory: [],
      };
    }

    const data = await response.json();
    return {
      error: false,
      listStory: data.listStory || [],
      message: data.message || "Success",
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      error: true,
      message: error.message || "Network error",
      listStory: [],
    };
  }
}

// == Add == //
export async function addStory(formData, token) {
  try {
    const response = await fetch(`${ENDPOINTS.STORIES}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    return {
      error: !response.ok,
      message: data.message || (response.ok ? "Success" : "Failed"),
    };
  } catch (error) {
    return {
      error: true,
      message: error.message,
    };
  }
}

// == Notif == //
export async function subscribePushNotification(subscription, token) {
  const subscriptionJson = subscription.toJSON();

  const payload = {
    endpoint: subscriptionJson.endpoint,
    keys: {
      p256dh: subscriptionJson.keys.p256dh,
      auth: subscriptionJson.keys.auth,
    },
  };

  const response = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}

export async function unsubscribePushNotification(endpoint, token) {
  try {
    const response = await fetch(ENDPOINTS.SUBSCRIBE, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ endpoint }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: data.message || "Gagal melakukan unsubscribe",
      };
    }

    return {
      error: false,
      data: data.data,
    };
  } catch (error) {
    return {
      error: true,
      message: error.message || "Terjadi kesalahan jaringan",
    };
  }
}

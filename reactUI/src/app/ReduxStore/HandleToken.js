// helper function to extract and set token from response headers
export const handleTokenFromResponse = (response) => {
    const token = response.headers["x-access-token"];
    if (token) {
      sessionStorage.setItem("token", token);
    }
    return token;
};
export const loginSite = async (login, password) => {
    const buildFormData = new FormData();
    buildFormData.append("login", login);
    buildFormData.append("password", password);
    const response = await fetch('/user/login', {
        method: 'POST',
        body: buildFormData
    });
    if(!response.ok) throw new Error("/user/login failed");
    const data = await response.json();
    return data;
};


export const registrationSite = async (login, password, email) => {
    const buildFormData = new FormData();
    buildFormData.append("login", login);
    buildFormData.append("password", password);
    buildFormData.append("email", email);
    const response = await fetch('/user/registration', {
        method: 'POST',
        body: buildFormData
    });
    if(!response.ok) throw new Error("/user/registration failed");
    const data = await response.json();
    return data;
};
export const getProjects = async (user, token) => {
    const formData = new FormData();
    formData.append('user', user); 
    const response = await fetch("/project/get", {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData,
    });
    if (!response.ok) throw new Error("/project/get failed");
    const data = await response.json();
    return data;
};


export const createProject = async (user, project, token) => {
    const formData = new FormData();
    formData.append('user', user);
    formData.append('project', project);
    const response = await fetch("/project/create", {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData,
    });
    if (!response.ok) throw new Error("/project/create failed");
    const data = await response.json();
    return data;
};


export const selectProject = async (user, project, token) => {
    const formData = new FormData();
    formData.append('user', user);
    formData.append('project', project);
    const response = await fetch("/file/get",{
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData,
    });
    if (!response.ok) throw new Error("/file/get");
    const data = await response.json();
    return data;
};

export const getFiles = async (user, project, fileId, token) => {
    const formData = new FormData();
    formData.append('user', user); 
    formData.append('project', project);
    formData.append('file', fileId);
    const response = await fetch("/file/load",{
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData,
    });
    if (!response.ok) throw new Error("/file/load failed");
    const contentType = response.headers.get('Content-Type');
    const data = contentType.split('boundary=')[1];
    const options = {
      boundary: data,
      buffer: await response.arrayBuffer(),
    };
    return options;
};

export const saveFiles = async (formData, token) => {
    const response = await fetch("/file/save", {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData,
    });
    if (!response.ok) throw new Error("/file/save failed");
};


export const deleteProject = async (user, project, token) => {
    const formData = new FormData();
    formData.append('user', user); 
    formData.append('project', project);
    const response = await fetch("/project/delete",{
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData,
    });
    if (!response.ok) throw new Error("/project/delete failed");
};


export const deleteFile = async (user, project, fileId, token) => {
    const formData = new FormData();
    formData.append('user', user); 
    formData.append('project', project);
    formData.append('file', fileId);
    const response = await fetch("/file/delete",{
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData,
    });
    if (!response.ok) throw new Error("/file/delete failed");
};
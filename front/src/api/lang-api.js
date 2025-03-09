export const getLanguages = async () => {
    const response = await fetch('/lang/languages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    });
    if(!response.ok) throw new Error("/lang/languages failed");
    const data = await response.json();
    return data;
};

export const getLanguageExtension = async (language) => {
    const buildFormData = new FormData();
    buildFormData.append("lang", language);
    const response = await fetch('/lang/code-extension', {
        method: 'POST',
        body: buildFormData
    });
    if(!response.ok) throw new Error("/lang/code-extension failed");
    const data = await response.text();
    return data;
};

export const getLanguageCompilers = async (language) => {
    const buildFormData = new FormData();
    buildFormData.append("lang", language);
    const response = await fetch('/lang/compilers', {
        method: 'POST',
        body: buildFormData
      });
    if(!response.ok) throw new Error("/lang/compilers failed");
    const data = await response.json();
    return data;
};

export const getRepresentationsLanguages = async (compiler) => {
    const buildFormData = new FormData();
    buildFormData.append('compiler', compiler);
    const response = await fetch('/lang/representation', {
      method: 'POST',
      body: buildFormData,
    });
    if(!response.ok) throw new Error("/lang/representation failed");
    const data = await response.json();
    return data;
};


export const getRepresentationExtension = async (selectedRepresentation) => {
    const buildFormData = new FormData();
    buildFormData.append('lang', selectedRepresentation);
    const response = await fetch('/lang/repr-extension', {
      method: 'POST',
      body: buildFormData,
    });
    if(!response.ok) throw new Error("/lang/repr-extension failed");
    const data = await response.text();
    return data;
};
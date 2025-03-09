export const translate = async (formData) => {
    const response = await fetch('/translate', {
      method: 'POST',
      body: formData,
    });
    if(!response.ok) throw new Error("/translate failed");
    const reader = response.body.getReader();
    let receivedLength = 0;
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      receivedLength += value.length;
    }

    const blob = new Blob(chunks);
    const doneRes = await blob.text();
    return doneRes;
};
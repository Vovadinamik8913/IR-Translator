import React, { useState, useEffect } from 'react';
import '../styles/Project.css';
import { deleteFile, deleteProject, getFiles, getProjects, saveFiles, createProject, selectProject } from '../api/projects-api';

const Projects = ({
  code, setCode,
  language, setLanguage,
  representation, setRepresentation,
  reprLanguage, setReprLanguage,
  compiler, setCompiler,
  flags, setFlags,
  onClose 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [projectFiles, setProjectFiles] = useState([]);


  const [newProjectName, setNewProjectName] = useState("");
  const [name, setName] = useState("");

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (!user) return;
    fetchProjects();
  }, [user]);

  if (!user) {
    return (
      <div className="projects-overlay">
        <div className="projects-modal not-registrated">
          <p>Нужна регистрация</p>
          <button onClick={onClose}>Закрыть</button>
        </div>
      </div>
    );
  }

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await getProjects(user, token);
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      alert("Введите название проекта");
      return;
    }
    try {
      setIsLoading(true);
      const createdProject = await createProject(user, newProjectName, token);
      setProjects((prev) => [...prev, createdProject]);
      setNewProjectName("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProject = async (e) => {
    const projectId = e.target.value;
    setSelectedProject(projectId);
    if (projectId) {
      try {
        setIsLoading(true);
        const project = projects.find((p) => p.id === Number(projectId));
        if (!project) return;
        const data = await selectProject(user, project.name, token);
        setProjectFiles(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setProjectFiles([]);
    }
  };
  
  const handleFileClick = async (fileId) => {
    try {
      setIsLoading(true);
      const project = projects.find((p) => p.id === Number(selectedProject));
      if (!project) {
        alert("Некорректный проект");
        return;
      }
      const data = await getFiles(user, project.name, Number(fileId), token);
      const parts = await parseMultipartResponse(data.buffer, data.boundary);
      console.log(parts);
      const metadata = JSON.parse(await parts.metadata.body.text());
      const codeBlob = await parts.code.body.text();
      const reprBlob = await parts.representation.body.text();
      setLanguage(metadata.codeLang);
      setCompiler(metadata.compiler);
      setReprLanguage(metadata.reprLang);
      setFlags(metadata.specialFlags);
      setCode(await codeBlob);
      setRepresentation(await reprBlob);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  async function parseMultipartResponse(arrayBuffer, boundary) {
    const parts = {};
    const decoder = new TextDecoder();
    const textData = decoder.decode(arrayBuffer);
    
    // Удаляем закрывающий boundary
    const cleanedData = textData.replace(`--${boundary}--`, '');
    const partsBytes = cleanedData.split(`--${boundary}`);
    
    for (const part of partsBytes) {
        const trimmedPart = part.trim();
        if (!trimmedPart) continue;

        const [headerSection, ...bodyParts] = trimmedPart.split('\r\n\r\n');
        const body = bodyParts.join('\r\n\r\n').trim();
        
        // Парсим заголовки
        const headers = new Headers();
        headerSection.split('\r\n').forEach(line => {
            const [name, value] = line.split(': ');
            if (name && value) headers.set(name.toLowerCase(), value);
        });

        // Извлекаем имя части
        const contentDisposition = headers.get('content-disposition');
        const nameMatch = contentDisposition?.match(/name="(.*?)"/i);
        if (!nameMatch) continue;

        const name = nameMatch[1];
        parts[name] = {
            headers,
            body: new Blob([new TextEncoder().encode(body)], { 
                type: headers.get('content-type') || 'application/octet-stream' 
            })
        };
    }
    
    return parts;
}

  const handleSaveToProject = async () => {
    if (!selectedProject) {
      alert("Сначала выберите проект");
      return;
    }
    const project = projects.find((p) => p.id === Number(selectedProject));
    if (!project) {
      alert("Некорректный проект");
      return;
    }

    if (!name.trim()) {
      alert("Введите имена для файлов code и representation");
      return;
    }

    try {
      setIsLoading(true);
      console.log(flags);
      const codeFile = new File([code], "code.txt", { type: 'text/plain' });
      const reprFile = new File([representation], "repr.txt", { type: 'text/plain' });
      const formData = new FormData();
      formData.append('user', user); 
      formData.append('project', project.name);
      formData.append('name', name);
      formData.append('language', language);
      formData.append('compiler', compiler);
      formData.append('reprLang', reprLanguage);
      formData.append('flags', flags.split(" "));
      formData.append('code', codeFile);
      formData.append('representation', reprFile);
      await saveFiles(formData, token);
      handleSelectProject({ target: { value: selectedProject } });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    setIsLoading(true);
    try {
      const project = projects.find((p) => p.id === Number(selectedProject));
      await deleteProject(user, project.name, token);
      setProjects(projects.filter((p) => p.id !== Number(selectedProject)));
      setSelectedProject('');
      setProjectFiles([]);
    } catch (error) {
      console.error('Ошибка при удалении проекта:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    setIsLoading(true);
    try {
      const project = projects.find((p) => p.id === Number(selectedProject));
      await deleteFile(user, project.name, Number(fileId), token);
      setProjectFiles(projectFiles.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error('Ошибка при удалении файла:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="projects-overlay">
      <div className="projects-modal">
        <h2>Проекты</h2>
        <div>
          <input
            type="text"
            placeholder="Название проекта"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button type='submit' onClick={handleCreateProject}>Создать новый проект</button>
        </div>

        <div>
          <select
            className='select-input'
            id="project-select"
            value={selectedProject}
            onChange={handleSelectProject}
          >
            <option value="">-- Не выбрано --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {selectedProject && (
            <div>
              <button onClick={handleDeleteProject}>
                Удалить проект
              </button>
            </div>
          )}
        </div>

        {selectedProject && projectFiles.length > 0 && (
          <div>
            <h3>Файлы проекта:</h3>
            <div className='files'>
              {projectFiles.map((file) => (
                <div>
                  <button
                    key={file.id}
                    onClick={() => handleFileClick(file.id)}
                  >
                    {`Название: ${file.name} | Язык: ${file.codeLang} | Представление: ${file.reprLang} | Компилятор: ${file.compiler} | Флаги: ${file.specialFlags}`}
                  </button>
                  <button
                    style={{ marginLeft: '8px' }}
                    onClick={() => handleDeleteFile(file.id)}
                  > x </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedProject && (
          <div>
            <h3>Сохранить code и representation в проект</h3>
            <div>
              <input
                type="text"
                placeholder="Имя файла"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button onClick={handleSaveToProject}>Сохранить</button>
            </div>
          </div>
        )}

        {isLoading && <p>Загрузка...</p>}

        <button className='close-button' onClick={onClose}>x</button>
      </div>
    </div>
  );
}

export default Projects;


import React, { useState, useEffect } from 'react';
import '../styles/Project.css';

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

  // Для создания нового проекта
  const [newProjectName, setNewProjectName] = useState("");

  // Для присвоения имени файлам при сохранении
  const [name, setName] = useState("");

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  // При первом рендере (или при смене user) — получаем список проектов
  useEffect(() => {
    if (!user) return;
    fetchProjects();
  }, [user]);

  // Проверяем, авторизован ли пользователь (например, по наличию user в localStorage)
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
      const formData = new FormData();
      formData.append('user', user); 
      // Замените URL и параметры запроса на ваши
      const response = await fetch("/project/get", {
        method: "POST",
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: formData,
      });
      if (!response.ok) throw new Error("Ошибка при загрузке проектов");
      const data = await response.json();
      // Предположим, что data — массив объектов { id, name }
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
      // Замените URL и метод запроса на ваши
      const formData = new FormData();
      formData.append('user', user); // Предполагается, что расширение соответствует языку
      formData.append('project', newProjectName);
      const response = await fetch("/project/create", {
        method: "POST",
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: formData,
      });
      if (!response.ok) throw new Error("Не удалось создать проект");
      const createdProject = await response.json();
      // Обновим список проектов в state
      setProjects((prev) => [...prev, createdProject]);
      setNewProjectName("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Выбор текущего проекта из селекта
  const handleSelectProject = async (e) => {
    const projectId = e.target.value;
    setSelectedProject(projectId);
    if (projectId) {
      try {
        setIsLoading(true);
        // Ищем в списке projects нужный объект чтобы узнать его name
        const project = projects.find((p) => p.id === Number(projectId));
        if (!project) return;
        const formData = new FormData();
        formData.append('user', user); 
        formData.append('project', project.name);
        const response = await fetch("/file/get",{
          method: "POST",
          headers: {
            'Authorization': 'Bearer ' + token
          },
          body: formData,
        });
        if (!response.ok) throw new Error("Не удалось загрузить файлы");
        const data = await response.json();
        // Предположим, что data — массив файлов
        // { id, name, language, representation, flags}
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
  // Обработчик "клика по файлу" — по желанию можно сделать, 
  // чтобы при нажатии подгружалось содержимое файла и т.д.
  const handleFileClick = async (fileId) => {
    try {
      setIsLoading(true);
      const project = projects.find((p) => p.id === Number(selectedProject));
      if (!project) {
        alert("Некорректный проект");
        return;
      }
      const formData = new FormData();
      formData.append('user', user); 
      formData.append('project', project.name);
      formData.append('file', Number(fileId));
      const response = await fetch("/file/load",{
        method: "POST",
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: formData,
      });
      if (!response.ok) throw new Error("Не удалось загрузить файлы");
      const data = await response.json();
      setLanguage(data.codeLang);
      setCompiler(data.compiler);
      setReprLanguage(data.reprLang);
      setFlags(data.specialFlags);
      setCode(toString(data.code));
      setRepresentation(toString(data.representation));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }

  };

  // Функция для преобразования строки Base64 в текст
  const toString = (base64) => {
    // Декодируем строку Base64
    const binaryString = window.atob(base64);
  
    // Создаем массив байтов из бинарной строки
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
  
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
  
    // Преобразуем массив байтов в строку с использованием TextDecoder
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
  }

  const handleSaveToProject = async () => {
    if (!selectedProject) {
      alert("Сначала выберите проект");
      return;
    }
    // Ищем выбранный проект из стейта, чтобы передать projectName
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
      // Пример отправки: возможно, вам нужно передавать файлы как FormData.
      // Здесь показано отправкой JSON (зависит от вашего сервера).
      const response = await fetch("/file/save", {
        method: "POST",
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: formData,
      });
      if (!response.ok) throw new Error("Не удалось сохранить файлы");
      const result = await response.json();
      console.log(result);
      // Можно обновить список файлов
      handleSelectProject({ target: { value: selectedProject } });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="projects-overlay">
      <div className="projects-modal">
        <h2>Проекты</h2>
        {/* Поле для ввода нового проекта + кнопка "создать" */}
        <div>
          <input
            type="text"
            placeholder="Название проекта"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button type='submit' onClick={handleCreateProject}>Создать новый проект</button>
        </div>

        {/* Dropdown проектов */}
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
        </div>

        {/* Список файлов (кнопками) при выборе проекта */}
        {selectedProject && projectFiles.length > 0 && (
          <div>
            <h3>Файлы проекта:</h3>
            <div className='files'>
              {projectFiles.map((file) => (
                <button
                  key={file.id}
                  onClick={() => handleFileClick(file.id)}
                >
                  {`Название: ${file.name} | Язык: ${file.codeLang} | Представление: ${file.reprLang} | Компилятор: ${file.compiler} | Флаги: ${file.specialFlags}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Поля для указания имен файлов при сохранении code и representation */}
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
            </div>
            <button onClick={handleSaveToProject}>Сохранить</button>
          </div>
        )}

        {isLoading && <p>Загрузка...</p>}

        <button className='close-button' onClick={onClose}>x</button>
      </div>
    </div>
  );
}

export default Projects;


'use client';

import React, { useEffect, useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

// File Tree Component
const FileTree = ({ data, onSelectFile, selectedFile }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="tree-children" style={{ marginLeft: 0, borderLeft: 'none' }}>
      {data.map((item) => (
        <TreeNode 
          key={item.path} 
          item={item} 
          onSelectFile={onSelectFile} 
          selectedFile={selectedFile} 
        />
      ))}
    </div>
  );
};

const TreeNode = ({ item, onSelectFile, selectedFile }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isDirectory = item.type === 'directory';
  const isSelected = selectedFile?.path === item.path;

  const handleClick = () => {
    if (isDirectory) {
      setIsOpen(!isOpen);
    } else {
      onSelectFile(item);
    }
  };

  return (
    <div className="tree-node">
      <div 
        className={`tree-item ${isSelected ? 'active' : ''}`}
        onClick={handleClick}
      >
        <div className="tree-item-icon">
          {isDirectory ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={isOpen ? "M6 9l6 6 6-6" : "M9 18l6-6-6-6"} />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          )}
        </div>
        <span>{item.name}</span>
      </div>
      
      {isDirectory && isOpen && item.children && (
        <FileTree 
          data={item.children} 
          onSelectFile={onSelectFile} 
          selectedFile={selectedFile} 
        />
      )}
    </div>
  );
};

// Main Page Component
export default function Page() {
  const [treeData, setTreeData] = useState([]);
  const [flatFiles, setFlatFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingTree, setLoadingTree] = useState(true);

  // Fetch Tree on Mount
  useEffect(() => {
    fetch('/api/files')
      .then(res => res.json())
      .then(data => {
        if (data.tree) {
          setTreeData(data.tree);
          
          // Flatten files for navigation (previous/next)
          const extractFiles = (nodes, parentPath = '') => {
            let files = [];
            nodes.forEach(node => {
              if (node.type === 'file') {
                files.push({ ...node, folderPath: parentPath });
              } else if (node.type === 'directory') {
                files = files.concat(extractFiles(node.children, node.path));
              }
            });
            return files;
          };
          
          const files = extractFiles(data.tree);
          setFlatFiles(files);
        }
      })
      .catch(err => console.error("Error fetching files:", err))
      .finally(() => setLoadingTree(false));
  }, []);

  // Fetch File Content when selection changes
  useEffect(() => {
    if (!selectedFile) return;
    
    setLoadingContent(true);
    fetch(`/api/file?path=${encodeURIComponent(selectedFile.path)}`)
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setFileContent(data.content);
        } else {
          setFileContent('# Error\nFailed to load file content.');
        }
      })
      .catch(err => {
        setFileContent('# Error\nFailed to load file content.');
        console.error("Error fetching file content:", err);
      })
      .finally(() => setLoadingContent(false));
  }, [selectedFile]);

  // Navigation Logic (Prev/Next in same folder)
  const navState = useMemo(() => {
    if (!selectedFile || flatFiles.length === 0) return { prev: null, next: null };
    
    // Find the currently selected file in our flatFiles array to get its folderPath
    const currentFlatFile = flatFiles.find(f => f.path === selectedFile.path);
    if (!currentFlatFile) return { prev: null, next: null };

    // Find all files in the same folder
    const filesInFolder = flatFiles.filter(f => f.folderPath === currentFlatFile.folderPath);
    const currentIndex = filesInFolder.findIndex(f => f.path === currentFlatFile.path);
    
    return {
      prev: currentIndex > 0 ? filesInFolder[currentIndex - 1] : null,
      next: currentIndex < filesInFolder.length - 1 ? filesInFolder[currentIndex + 1] : null,
    };
  }, [selectedFile, flatFiles]);

  return (
    <div className="app-container">
      {/* Sidebar - File Tree */}
      <aside className="sidebar">
        <div className="sidebar-header">
          MD Explorer
        </div>
        <div className="sidebar-content">
          {loadingTree ? (
            <div className="loader-container">
              <div className="spinner"></div>
              <span>Cargando archivos...</span>
            </div>
          ) : treeData.length > 0 ? (
            <FileTree 
              data={treeData} 
              onSelectFile={setSelectedFile} 
              selectedFile={selectedFile} 
            />
          ) : (
            <div className="empty-state">
              <p>No se encontraron archivos Markdown.</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-area">
        <div className="content-viewer">
          {selectedFile ? (
            loadingContent ? (
              <div className="loader-container">
                <div className="spinner"></div>
                <span>Cargando documento...</span>
              </div>
            ) : (
              <div className="markdown-body">
                <ReactMarkdown>{fileContent}</ReactMarkdown>
              </div>
            )
          ) : (
            <div className="empty-state">
              <h2>Bienvenido a MD Browser</h2>
              <p>Seleccioná un archivo de la barra lateral para visualizarlo.</p>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="bottom-nav">
          <button 
            className="nav-button"
            disabled={!navState.prev}
            onClick={() => navState.prev && setSelectedFile(navState.prev)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Anterior
          </button>
          
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {selectedFile ? selectedFile.name : 'Ningún archivo seleccionado'}
          </div>

          <button 
            className="nav-button"
            disabled={!navState.next}
            onClick={() => navState.next && setSelectedFile(navState.next)}
          >
            Siguiente
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}

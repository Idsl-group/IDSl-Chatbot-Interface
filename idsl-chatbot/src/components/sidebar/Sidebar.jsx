import React, { useState, useEffect, useRef } from 'react';
import { Upload, Download, Search, Database, Brain, Settings, History, Trash2, RotateCcw, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ onStateChange }) => {
  // State management
  const [strategy, setStrategy] = useState('LLM');
  const [agent, setAgent] = useState('LLM');
  const [useRag, setUseRag] = useState(true);
  const [useSql, setUseSql] = useState(false);
  const [selectedTools, setSelectedTools] = useState(['All']);
  const [toolNames, setToolNames] = useState(['All']);
  const [folderPath, setFolderPath] = useState('');
  const [downloadKeywords, setDownloadKeywords] = useState('');
  const [numDownloads, setNumDownloads] = useState(10);
  const [downloadFlags, setDownloadFlags] = useState({
    bioarxiv: false,
    pubmed: false,
    scholar: false
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [sqlMetadata, setSqlMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Dropdown states
  const [dropdownStates, setDropdownStates] = useState({
    chainOfThought: false,
    toolSelection: false,
    downloadSources: false,
    ragFunctions: false,
    memoryFunctions: false,
    sqlSettings: false
  });

  // Refs for drag and drop
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Toggle dropdown state
  const toggleDropdown = (dropdown) => {
    setDropdownStates(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  // Load available tools on component mount
  useEffect(() => {
    const loadTools = async () => {
      try {
        // Placeholder: Fetch Tools from Backend
      } catch (error) {
        console.error('Failed to load tools:', error);
      }
    };
    loadTools();
  }, []);


  // Notify parent component of state changes
  useEffect(() => {
    const sidebarState = {
      strategy,
      agent,
      useRag,
      useSql,
      selectedTools,
      sqlMetadata,
      folderPath,
      uploadedFiles,
      downloadFlags
    };
    onStateChange?.(sidebarState);
  }, [strategy, agent, useRag, useSql, selectedTools, sqlMetadata, folderPath, uploadedFiles, downloadFlags, onStateChange]);

  // Handle strategy change
  const handleStrategyChange = (newStrategy) => {
    setStrategy(newStrategy);
    if (newStrategy === 'LLM') {
      setAgent('LLM');
    } else if (newStrategy === 'Tool Calling') {
      setAgent('ReACT');
    }
  };

  // Handle tool selection
  const handleToolSelection = (tool) => {
    if (tool === 'All') {
      setSelectedTools(['All']);
    } else {
      const newTools = selectedTools.includes('All') 
        ? [tool]
        : selectedTools.includes(tool)
          ? selectedTools.filter(t => t !== tool)
          : [...selectedTools, tool];
      
      setSelectedTools(newTools.length === 0 ? ['All'] : newTools);
    }
  };

  // Enable users to drag files into the drop zone 
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dropZoneRef.current?.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      const validTypes = ['.pdf', '.epub', '.docx', '.txt', '.csv'];
      return validTypes.some(type => file.name.toLowerCase().endsWith(type));
    });
    
    if (validFiles.length > 0) {
      // Placeholder: Handle dropped files
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
     const files = Array.from(event.target.files);
     setUploadedFiles(files);
  };

  // Handle folder path change
  const handleFolderPathChange = (path) => {
    setFolderPath(path);
  };

  // API call handlers
  const handleUpload = async () => {
    // Placeholder: Upload files to backend
  };

  const handleAnalyze = async () => {
    // Placeholder: Analyze uploaded files
  };

  const handleReset = async () => {
    // Placeholder: Reset RAG knowledge base
  };

  const handleDownloadFiles = async () => {
    // Placeholder: Download documents from sources
  };

  const handlePrintHistory = () => {
    // Placeholder: Print memory history
  };

  const handleClearHistory = () => {
    // Placeholder: Clear memory history
  };

  // Dropdown component
  const DropdownSection = ({ title, icon: Icon, isOpen, onToggle, children, className = "" }) => (
    <div className={`dropdown-section ${className}`}>
      <button
        onClick={onToggle}
        className="dropdown-header"
      >
        <div className="dropdown-header-content">
          <Icon className="dropdown-icon" />
          <span className="dropdown-title">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="chevron-icon" /> : <ChevronDown className="chevron-icon" />}
      </button>
      {isOpen && (
        <div className="dropdown-content">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        
        {/* Agent Type Selection */}
        <div className="section agent-type-section">
          <h3 className="section-title">
            <Settings className="section-icon" />
            Agent Type
          </h3>
          <div className="radio-group">
            {['LLM', 'RAG Download', 'Tool Calling'].map((type) => (
              <label key={type} className="radio-label">
                <input
                  type="radio"
                  name="strategy"
                  value={type}
                  checked={strategy === type}
                  onChange={(e) => handleStrategyChange(e.target.value)}
                  className="radio-input"
                />
                <span className="radio-text">{type}</span>
              </label>
            ))}
          </div>
          
          {/* Use RAG checkbox for non-Tool Calling strategies */}
          {strategy !== 'Tool Calling' && (
            <div className="rag-checkbox-section">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={useRag}
                  onChange={(e) => setUseRag(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-text">Enable RAG</span>
              </label>
            </div>
          )}
        </div>

        {/* Chain of Thought - Dropdown */}
        {strategy === 'Tool Calling' && (
          <DropdownSection
            title="Chain of Thought"
            icon={Brain}
            isOpen={dropdownStates.chainOfThought}
            onToggle={() => toggleDropdown('chainOfThought')}
          >
            <div className="radio-group dropdown-radio-group">
              {['ReACT', 'Plan and Solve'].map((type) => (
                <label key={type} className="radio-label">
                  <input
                    type="radio"
                    name="agent"
                    value={type}
                    checked={agent === type}
                    onChange={(e) => setAgent(e.target.value)}
                    className="radio-input"
                  />
                  <span className="radio-text">{type}</span>
                </label>
              ))}
            </div>
          </DropdownSection>
        )}

        {/* Tool Selection - Dropdown */}
        {strategy === 'Tool Calling' && (
          <DropdownSection
            title="Tool Selection"
            icon={Settings}
            isOpen={dropdownStates.toolSelection}
            onToggle={() => toggleDropdown('toolSelection')}
          >
            <div className="tool-selection-content">
              <div className="tool-list">
                {toolNames.map((tool) => (
                  <label key={tool} className="checkbox-label tool-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedTools.includes(tool)}
                      onChange={() => handleToolSelection(tool)}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">{tool}</span>
                  </label>
                ))}
              </div>
              {selectedTools.length === 0 && (
                <p className="error-text">Select at least one tool</p>
              )}
              
              {/* Tool Calling specific options */}
              <div className="tool-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={useRag}
                    onChange={(e) => setUseRag(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">Allow tools to update RAG</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={useSql}
                    onChange={(e) => setUseSql(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">Connect SQL Database</span>
                </label>
              </div>
            </div>
          </DropdownSection>
        )}

        {/* Memory Functions - Dropdown */}
        <DropdownSection
          title="Memory Functions"
          icon={History}
          isOpen={dropdownStates.memoryFunctions}
          onToggle={() => toggleDropdown('memoryFunctions')}
        >
          <div className="button-grid">
            <button
              onClick={handlePrintHistory}
              className="btn btn-primary"
            >
              <History className="btn-icon" />
              Print History
            </button>
            <button
              onClick={handleClearHistory}
              className="btn btn-danger"
            >
              <Trash2 className="btn-icon" />
              Clear History
            </button>
          </div>
        </DropdownSection>

        {/* RAG Functions - Document Management with Drag and Drop */}
        <DropdownSection
          title="Document Management"
          icon={FileText}
          isOpen={dropdownStates.ragFunctions}
          onToggle={() => toggleDropdown('ragFunctions')}
        >
          <div className="document-management">
            <div className="input-group">
              <label className="input-label">
                Document Folder Path
              </label>
              <input
                type="text"
                value={folderPath}
                onChange={(e) => handleFolderPathChange(e.target.value)}
                className="text-input"
                placeholder="Enter folder path"
              />
            </div>

            {strategy !== 'RAG Download' && (
              <div className="upload-section">
                <label className="input-label">
                  Upload Documents
                </label>
                
                {/* Drag and Drop Zone */}
                <div
                  ref={dropZoneRef}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`drop-zone ${isDragging ? 'drop-zone-active' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="drop-zone-content">
                    <Upload className="drop-zone-icon" />
                    <p className="drop-zone-text">
                      {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="drop-zone-subtext">
                      PDF, EPUB, DOCX, TXT, CSV files
                    </p>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.epub,.docx,.txt,.csv"
                  onChange={handleFileUpload}
                  className="file-input-hidden"
                />

                {/* Display uploaded files */}
                {uploadedFiles.length > 0 && (
                  <div className="uploaded-files">
                    <p className="uploaded-files-title">Uploaded Files:</p>
                    <ul className="uploaded-files-list">
                      {uploadedFiles.map((file, index) => (
                        <li key={index} className="uploaded-file-item">
                          <FileText className="file-icon" />
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="button-grid">
              <button
                onClick={handleUpload}
                disabled={loading}
                className="btn btn-success"
              >
                <Upload className="btn-icon" />
                Process Documents
              </button>
              <button
                onClick={handleReset}
                disabled={loading}
                className="btn btn-danger"
              >
                <RotateCcw className="btn-icon" />
                Reset Knowledge Base
              </button>
            </div>
          </div>
        </DropdownSection>

        {/* Download Sources - Dropdown (for RAG Download strategy) */}
        {strategy === 'RAG Download' && (
          <DropdownSection
            title="Download Sources"
            icon={Download}
            isOpen={dropdownStates.downloadSources}
            onToggle={() => toggleDropdown('downloadSources')}
          >
            <div className="download-sources">
              <div className="checkbox-group">
                <label className="input-label">Select Sources</label>
                {['bioarxiv', 'pubmed', 'scholar'].map((source) => (
                  <label key={source} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={downloadFlags[source]}
                      onChange={(e) => setDownloadFlags(prev => ({
                        ...prev,
                        [source]: e.target.checked
                      }))}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">
                      {source === 'bioarxiv' ? 'BioRxiv' : source === 'pubmed' ? 'PubMed' : 'Google Scholar'}
                    </span>
                  </label>
                ))}
              </div>

              <div className="input-group">
                <label className="input-label">
                  Search Keywords
                </label>
                <input
                  type="text"
                  value={downloadKeywords}
                  onChange={(e) => setDownloadKeywords(e.target.value)}
                  placeholder="Enter search keywords"
                  className="text-input"
                />
                <p className="input-helper">Space separated keywords for document search</p>
              </div>

              <div className="input-group">
                <label className="input-label">
                  Number of Documents
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={numDownloads}
                  onChange={(e) => setNumDownloads(parseInt(e.target.value))}
                  className="text-input"
                />
              </div>

              <button
                onClick={handleDownloadFiles}
                disabled={loading}
                className="btn btn-primary btn-full-width"
              >
                <Download className="btn-icon" />
                Download Documents
              </button>
            </div>
          </DropdownSection>
        )}

        {/* SQL Settings - Dropdown (when SQL is enabled) */}
        {useSql && (
          <DropdownSection
            title="SQL Database Settings"
            icon={Database}
            isOpen={dropdownStates.sqlSettings}
            onToggle={() => toggleDropdown('sqlSettings')}
          >
            <div className="sql-settings">
              {sqlMetadata ? (
                <div className="sql-metadata">
                  {Object.entries(sqlMetadata).map(([key, value]) => (
                    <div key={key} className="metadata-row">
                      <span className="metadata-key">{key}:</span>
                      <span className="metadata-value">{value || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="sql-placeholder">
                  SQL metadata will appear here when database is connected.
                </div>
              )}
            </div>
          </DropdownSection>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
            <span className="loading-text">Processing...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
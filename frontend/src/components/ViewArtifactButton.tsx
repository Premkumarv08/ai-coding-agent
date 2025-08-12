import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from './ui/button';
import { Code, Eye } from 'lucide-react';
import { toggleSidebar } from '../store/sidebarSlice';
import { RootState } from '../store/store';
import { extractCodeArtifacts } from '../lib/utils';

export const ViewArtifactButton: React.FC = () => {
  const messages = useSelector((state: RootState) => state.chat.messages);
  const { currentArtifact } = useSelector((state: RootState) => state.sidebar);
  const dispatch = useDispatch();

  // Find the latest assistant message with code artifacts
  const latestAssistantMessage = messages
    .filter(msg => msg.role === 'assistant' && !msg.isStreaming)
    .pop();

  if (!latestAssistantMessage) {
    return null;
  }

  const codeArtifacts = extractCodeArtifacts(latestAssistantMessage.content);
  
  if (codeArtifacts.length === 0) {
    return null;
  }

  // Use the first code artifact for the button
  const firstArtifact = {
    id: Date.now().toString(),
    language: codeArtifacts[0].language,
    code: codeArtifacts[0].code,
    filename: codeArtifacts[0].filename,
  };

  const handleViewArtifact = () => {
    if (currentArtifact && currentArtifact.id === firstArtifact.id) {
      // If the same artifact is already open, close the sidebar
      dispatch(toggleSidebar(null));
    } else {
      // Open the sidebar with the new artifact
      dispatch(toggleSidebar(firstArtifact));
    }
  };

  return (
    <div className="flex justify-center p-4">
      <Button
        onClick={handleViewArtifact}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Code className="w-4 h-4" />
        View Generated Artifact
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );
};

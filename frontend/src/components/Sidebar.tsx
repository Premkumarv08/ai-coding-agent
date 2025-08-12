import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Button } from './ui/button';
import { X, Code, Eye } from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { CodePreview } from './CodePreview';
import { closeSidebar, setActiveView } from '../store/sidebarSlice';
import { RootState } from '../store/store';

export const Sidebar: React.FC = () => {
  const { isOpen, activeView, currentArtifact } = useSelector((state: RootState) => state.sidebar);
  const dispatch = useDispatch();

  if (!isOpen || !currentArtifact) {
    return null;
  }

  const handleClose = () => {
    dispatch(closeSidebar());
  };

  const handleViewChange = (value: string) => {
    dispatch(setActiveView(value as 'code' | 'preview'));
  };

  return (
    <div className="w-96 border-l bg-background flex flex-col">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="text-sm font-medium">Generated Artifact</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeView} onValueChange={handleViewChange} className="flex-1 flex flex-col">
        <div className="p-3 border-b">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="w-3 h-3" />
              Code
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-3 h-3" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="code" className="h-full m-0">
            <CodeEditor artifact={currentArtifact} />
          </TabsContent>
          
          <TabsContent value="preview" className="h-full m-0">
            <CodePreview artifact={currentArtifact} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

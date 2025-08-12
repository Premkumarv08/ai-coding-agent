import { ChatArea } from './components/ChatArea';
import { ChatInput } from './components/ChatInput';
import { Sidebar } from './components/Sidebar';
import { ViewArtifactButton } from './components/ViewArtifactButton';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { cn } from './lib/utils';

function App() {
  const { isOpen } = useSelector((state: RootState) => state.sidebar);

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <div className={cn(
        "flex flex-col flex-1 transition-all duration-300 min-w-0",
        isOpen ? "w-[calc(100vw-384px)]" : "w-full"
      )}>
        <div className="border-b bg-background p-4 flex-shrink-0">
          <h1 className="text-xl font-semibold">AI Coding Agent</h1>
          <p className="text-sm text-muted-foreground">Powered by Gemini 2.5</p>
        </div>

        <div className="flex-1 overflow-hidden">
          <ChatArea />
        </div>

        <ViewArtifactButton />

        <ChatInput />
      </div>

      <Sidebar />
    </div>
  );
}

export default App;

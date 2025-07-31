import { useState } from 'react';
import { ChevronDown, Download, Settings, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProjectCreator } from './project-creator';

interface MinimalNavBarProps {
  projectTitle: string;
  onExport: () => void;
  onSettings: () => void;
}

export function MinimalNavBar({ projectTitle, onExport, onSettings }: MinimalNavBarProps) {
  const [projects] = useState([
    { id: '1', title: projectTitle },
    { id: '2', title: 'AI Healthcare Platform' },
    { id: '3', title: 'Sustainable Energy Solution' },
  ]);

  return (
    <nav className="glass-card border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo & Project Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-section font-semibold text-gray-900">PitchDeck AI</span>
          </div>
          
          <div className="h-6 w-px bg-gray-300" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 font-medium">
                {projectTitle}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                Recent Projects
              </div>
              <DropdownMenuSeparator />
              {projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  className={project.title === projectTitle ? 'bg-primary/10' : ''}
                >
                  {project.title}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <ProjectCreator />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="interactive-hover"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettings}
            className="interactive-hover"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
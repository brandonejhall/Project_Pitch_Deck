import { useState, useEffect } from 'react';
import { ChevronDown, Download, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProjectCreator } from './project-creator';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/use-api';
import { Link } from 'react-router-dom';

interface MinimalNavBarProps {
  projectTitle: string;
  onExport: () => void;
  onSettings: () => void;
}

export function MinimalNavBar({ projectTitle, onExport, onSettings }: MinimalNavBarProps) {
  const { logout, user } = useAuth();
  const { getProjects } = useApi();
  const [projects, setProjects] = useState([
    { id: '1', title: projectTitle },
  ]);

  // Load user's projects
  useEffect(() => {
    if (user) {
      const loadProjects = async () => {
        try {
          const userProjects = await getProjects();
          if (userProjects && userProjects.length > 0) {
            setProjects(userProjects.map(project => ({
              id: project.id.toString(),
              title: project.title
            })));
          }
        } catch (error) {
          console.error('Failed to load projects:', error);
        }
      };
      
      loadProjects();
    }
  }, [user, getProjects]);

  return (
    <nav className="glass-card border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Project Selector */}
        <div className="flex items-center gap-4">
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
          
          {/* Settings button hidden for now */}
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={onSettings}
            className="interactive-hover"
          >
            <Settings className="w-4 h-4" />
          </Button> */}

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="interactive-hover"
          >
            <Link to="/projects">
              <FolderOpen className="w-4 h-4 mr-2" />
              Projects
            </Link>
          </Button>
          
          {/* Logout button removed - already available in main nav */}
        </div>
      </div>
    </nav>
  );
}
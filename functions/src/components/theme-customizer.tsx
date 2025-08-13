
'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useConfig } from '@/hooks/use-config';
import { Button } from '@/components/ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';

export function ThemeCustomizer() {
  const [config, setConfig] = useConfig();
  const { setTheme: setMode, resolvedTheme: mode } = useTheme();

  return (
    <div className="p-4 space-y-6">
       <div className="space-y-4">
        <Label className="text-base">Accent Color</Label>
        <div className="flex items-center space-x-2">
           <input
            type="color"
            value={config.accentColor || '#000000'}
            onChange={(e) =>
              setConfig({ ...config, accentColor: e.target.value })
            }
            className="w-12 h-10 rounded-lg border p-1"
          />
          <span className="text-sm text-muted-foreground">Custom</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <Label className="text-base">Font</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={config.font === 'inter' ? 'default' : 'outline'}
            onClick={() => setConfig({ ...config, font: 'inter' })}
          >
            Inter
          </Button>
           <Button
            variant={config.font === 'poppins' ? 'default' : 'outline'}
            onClick={() => setConfig({ ...config, font: 'poppins' })}
          >
            Poppins
          </Button>
          <Button
            variant={config.font === 'literata' ? 'default' : 'outline'}
            onClick={() => setConfig({ ...config, font: 'literata' })}
          >
            Literata
          </Button>
           <Button
            variant={config.font === 'source-serif' ? 'default' : 'outline'}
            onClick={() => setConfig({ ...config, font: 'source-serif' })}
          >
            Source Serif
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <Label className="text-base">Border Thickness</Label>
        <Slider
          min={0}
          max={10}
          step={1}
          value={[config.borderWidth ?? 1]}
          onValueChange={(value) => setConfig({ ...config, borderWidth: value[0] })}
        />
        <div className="text-sm text-muted-foreground text-center">
          {config.borderWidth ?? 1}px
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base">Mode</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={mode === 'light' ? 'default' : 'outline'}
            onClick={() => setMode('light')}
          >
            <Sun className="mr-2" /> Light
          </Button>
          <Button
            variant={mode === 'dark' ? 'default' : 'outline'}
            onClick={() => setMode('dark')}
          >
            <Moon className="mr-2" /> Dark
          </Button>
        </div>
      </div>
    </div>
  );
}

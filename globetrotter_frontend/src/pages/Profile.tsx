import { useState } from 'react';
import { User, Mail, Globe, Trash2, Save, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [language, setLanguage] = useState(user?.language || 'en');

  const handleSave = () => {
    updateUser({ name, language });
    toast({ title: 'Profile updated!' });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-display font-bold mb-8">Profile Settings</h1>

        <Card variant="featured" className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full gradient-bg-sunset flex items-center justify-center text-4xl font-bold text-primary-foreground">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-card shadow-medium border border-border">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={user?.email || ''} disabled className="opacity-60" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" /> Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="flex h-12 w-full rounded-xl border-2 border-input bg-card px-4 py-3"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>

            <Button variant="hero" className="w-full gap-2" onClick={handleSave}>
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card variant="default" className="border-destructive/30">
          <CardContent className="p-6">
            <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back.
            </p>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" /> Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

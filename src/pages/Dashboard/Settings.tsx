import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  
  // Account settings state
  const [accountForm, setAccountForm] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    assignmentReminders: true,
    gradeUpdates: true,
    courseAnnouncements: true
  });

  // Appearance settings state
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    textSize: "medium",
    contrastMode: false
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    showProfile: true,
    showProgress: true,
    allowDataCollection: true
  });

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleAppearanceChange = (key, value) => {
    setAppearanceSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePrivacyChange = (key) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const saveAccountSettings = (e) => {
    e.preventDefault();
    
    // Password validation
    if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Your new password and confirmation password do not match.",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would integrate with your auth service to update user details
    toast({
      title: "Account settings saved",
      description: "Your account information has been updated successfully."
    });
  };

  const saveNotificationSettings = () => {
    // Here you would integrate with your backend to save notification preferences
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved."
    });
  };

  const saveAppearanceSettings = () => {
    // Here you would implement theme/appearance changes
    toast({
      title: "Appearance settings updated",
      description: "Your display preferences have been saved."
    });
  };

  const savePrivacySettings = () => {
    // Here you would update privacy settings in your backend
    toast({
      title: "Privacy settings updated",
      description: "Your privacy preferences have been saved."
    });
  };

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        
        {/* Account Settings */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Update your personal information and manage your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={saveAccountSettings}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={accountForm.name} 
                    onChange={handleAccountChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={accountForm.email} 
                    onChange={handleAccountChange}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    name="currentPassword" 
                    type="password" 
                    value={accountForm.currentPassword} 
                    onChange={handleAccountChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    name="newPassword" 
                    type="password" 
                    value={accountForm.newPassword} 
                    onChange={handleAccountChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    value={accountForm.confirmPassword} 
                    onChange={handleAccountChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch 
                  id="emailNotifications" 
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={() => handleNotificationChange('emailNotifications')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="assignmentReminders">Assignment Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminders about upcoming assignments
                  </p>
                </div>
                <Switch 
                  id="assignmentReminders" 
                  checked={notificationSettings.assignmentReminders}
                  onCheckedChange={() => handleNotificationChange('assignmentReminders')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="gradeUpdates">Grade Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Be notified when your grades are updated
                  </p>
                </div>
                <Switch 
                  id="gradeUpdates" 
                  checked={notificationSettings.gradeUpdates}
                  onCheckedChange={() => handleNotificationChange('gradeUpdates')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="courseAnnouncements">Course Announcements</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about course announcements
                  </p>
                </div>
                <Switch 
                  id="courseAnnouncements" 
                  checked={notificationSettings.courseAnnouncements}
                  onCheckedChange={() => handleNotificationChange('courseAnnouncements')}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveNotificationSettings}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how the application looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select 
                  value={appearanceSettings.theme} 
                  onValueChange={(value) => handleAppearanceChange('theme', value)}
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System Default</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="textSize">Text Size</Label>
                <Select 
                  value={appearanceSettings.textSize} 
                  onValueChange={(value) => handleAppearanceChange('textSize', value)}
                >
                  <SelectTrigger id="textSize">
                    <SelectValue placeholder="Select text size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="contrastMode">High Contrast Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable high contrast for better visibility
                  </p>
                </div>
                <Switch 
                  id="contrastMode" 
                  checked={appearanceSettings.contrastMode}
                  onCheckedChange={(value) => handleAppearanceChange('contrastMode', value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveAppearanceSettings}>Save Appearance</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your privacy preferences and data sharing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showProfile">Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow others to view your profile information
                  </p>
                </div>
                <Switch 
                  id="showProfile" 
                  checked={privacySettings.showProfile}
                  onCheckedChange={() => handlePrivacyChange('showProfile')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showProgress">Progress Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow others to see your learning progress
                  </p>
                </div>
                <Switch 
                  id="showProgress" 
                  checked={privacySettings.showProgress}
                  onCheckedChange={() => handlePrivacyChange('showProgress')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowDataCollection">Data Collection</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow us to collect usage data to improve your experience
                  </p>
                </div>
                <Switch 
                  id="allowDataCollection" 
                  checked={privacySettings.allowDataCollection}
                  onCheckedChange={() => handlePrivacyChange('allowDataCollection')}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={savePrivacySettings}>Save Privacy Settings</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Manage your account data and privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Download Your Data</h3>
                <p className="text-sm text-muted-foreground">
                  Get a copy of all the data we have stored about you
                </p>
                <Button variant="outline">Download Data</Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-medium text-destructive">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

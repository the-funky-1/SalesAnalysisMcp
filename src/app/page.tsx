"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/ui/file-upload';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { 
  BarChart3, 
  Brain, 
  MessageSquare, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle,
  Upload,
  Settings,
  Home
} from 'lucide-react';

interface AnalysisResult {
  analysisId: string;
  timestamp: string;
  processingTime: number;
  analyses: {
    conversation: any;
    psychology: any;
    objections: any;
    dealRisk: any;
    actionPlan: any;
    qualification: any;
  };
  summary: {
    overallQualificationScore: number;
    investmentReadiness: string;
    keyInsights: string[];
    criticalActions: string[];
    riskLevel: string;
    recommendedNextSteps: string[];
  };
}

const sidebarLinks = [
  {
    label: "Dashboard",
    href: "#dashboard",
    icon: <Home className="h-5 w-5" />
  },
  {
    label: "Analysis",
    href: "#analysis",
    icon: <BarChart3 className="h-5 w-5" />
  },
  {
    label: "Psychology",
    href: "#psychology",
    icon: <Brain className="h-5 w-5" />
  },
  {
    label: "Conversation",
    href: "#conversation",
    icon: <MessageSquare className="h-5 w-5" />
  },
  {
    label: "Settings",
    href: "#settings",
    icon: <Settings className="h-5 w-5" />
  }
];

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [metadata, setMetadata] = useState({
    prospectName: '',
    prospectAge: '',
    retirementStatus: '',
    accountTypes: [] as string[],
    accountValues: '',
    familyMembers: '',
    investmentExperience: '',
    goldIRAInterest: '',
    currentConcerns: '',
    timeframe: '',
    duration: '',
    salesRep: '',
    callPurpose: '',
    previousContact: false
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setTranscript(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!transcript || !metadata.prospectName) {
      alert('Please provide both transcript and prospect name');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Mock analysis for demo - replace with actual MCP server call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResult: AnalysisResult = {
        analysisId: 'analysis-' + Date.now(),
        timestamp: new Date().toISOString(),
        processingTime: 2847,
        analyses: {
          conversation: {
            conversationScorecard: {
              overallQuality: 78,
              discovery: 85,
              rapportBuilding: 72,
              valuePresentation: 68,
              objectionHandling: 75,
              nextStepsClarity: 82
            }
          },
          psychology: {
            personalityType: {
              primary: 'analytical',
              confidence: 85
            }
          },
          objections: {},
          dealRisk: {},
          actionPlan: {},
          qualification: {
            qualificationSummary: {
              opportunityScore: 78,
              recommendation: 'proceed_cautiously'
            }
          }
        },
        summary: {
          overallQualificationScore: 78,
          investmentReadiness: 'medium',
          keyInsights: [
            'Strong analytical personality with data-driven decision making',
            'Family involvement crucial for decision process',
            'Budget qualified but timeline needs clarification'
          ],
          criticalActions: [
            'Schedule joint call with spouse',
            'Send IRA rollover education materials',
            'Address gold storage concerns'
          ],
          riskLevel: 'medium',
          recommendedNextSteps: [
            'Follow up within 24 hours',
            'Provide educational materials',
            'Schedule family consultation'
          ]
        }
      };
      
      setAnalysisResult(mockResult);
      setActiveSection('analysis');
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gold IRA Sales Analysis</h1>
        <Badge variant="outline" className="text-lg px-3 py-1">
          Order: 2→3→4→5→6→1
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transcript Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Sales Call Transcript
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUpload onChange={handleFileUpload} />
            <div className="space-y-2">
              <Label>Or paste transcript directly:</Label>
              <Textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste the Gold IRA sales call transcript here..."
                className="min-h-[200px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Metadata Form */}
        <Card>
          <CardHeader>
            <CardTitle>Call Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prospect Name *</Label>
                <Input
                  value={metadata.prospectName}
                  onChange={(e) => setMetadata({...metadata, prospectName: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <Input
                  type="number"
                  value={metadata.prospectAge}
                  onChange={(e) => setMetadata({...metadata, prospectAge: e.target.value})}
                  placeholder="65"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Retirement Status</Label>
              <Select value={metadata.retirementStatus} onValueChange={(value) => setMetadata({...metadata, retirementStatus: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre-retirement">Pre-Retirement</SelectItem>
                  <SelectItem value="recently-retired">Recently Retired</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Investment Experience</Label>
              <Select value={metadata.investmentExperience} onValueChange={(value) => setMetadata({...metadata, investmentExperience: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="experienced">Experienced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Gold IRA Interest</Label>
              <Select value={metadata.goldIRAInterest} onValueChange={(value) => setMetadata({...metadata, goldIRAInterest: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select interest level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="researching">Researching</SelectItem>
                  <SelectItem value="considering">Considering</SelectItem>
                  <SelectItem value="ready-to-act">Ready to Act</SelectItem>
                  <SelectItem value="undecided">Undecided</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Call Duration (min)</Label>
                <Input
                  type="number"
                  value={metadata.duration}
                  onChange={(e) => setMetadata({...metadata, duration: e.target.value})}
                  placeholder="32"
                />
              </div>
              <div className="space-y-2">
                <Label>Sales Rep</Label>
                <Input
                  value={metadata.salesRep}
                  onChange={(e) => setMetadata({...metadata, salesRep: e.target.value})}
                  placeholder="John Smith"
                />
              </div>
            </div>

            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !transcript || !metadata.prospectName}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                'Analyze Transcript'
              )}
            </Button>

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Processing prompts: 2→3→4→5→6→1</div>
                <Progress value={66} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAnalysis = () => {
    if (!analysisResult) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No analysis results yet. Please run an analysis first.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Analysis Results</h2>
          <div className="flex gap-2">
            <Badge variant="outline">Score: {analysisResult.summary.overallQualificationScore}/100</Badge>
            <Badge variant={analysisResult.summary.investmentReadiness === 'high' ? 'default' : 'secondary'}>
              {analysisResult.summary.investmentReadiness.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Qualification Score</p>
                  <p className="text-3xl font-bold">{analysisResult.summary.overallQualificationScore}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Investment Ready</p>
                  <p className="text-xl font-bold capitalize">{analysisResult.summary.investmentReadiness}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Risk Level</p>
                  <p className="text-xl font-bold capitalize">{analysisResult.summary.riskLevel}</p>
                </div>
                <AlertTriangle className={`h-8 w-8 ${
                  analysisResult.summary.riskLevel === 'low' ? 'text-green-600' :
                  analysisResult.summary.riskLevel === 'medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Processing Time</p>
                  <p className="text-xl font-bold">{analysisResult.processingTime}ms</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversation Scorecard */}
          <Card>
            <CardHeader>
              <CardTitle>Conversation Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analysisResult.analyses.conversation.conversationScorecard).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-sm">{value}/100</span>
                    </div>
                    <Progress value={value as number} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysisResult.summary.keyInsights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Critical Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Critical Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysisResult.summary.criticalActions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{action}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysisResult.summary.recommendedNextSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{step}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mt-8 flex flex-col gap-2">
              {sidebarLinks.map((link, idx) => (
                <SidebarLink 
                  key={idx} 
                  link={{
                    ...link,
                    href: '#'
                  }}
                  onClick={() => setActiveSection(link.href.replace('#', ''))}
                  className={activeSection === link.href.replace('#', '') ? 'bg-gray-200 dark:bg-gray-700' : ''}
                />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection === 'analysis' && renderAnalysis()}
          {activeSection === 'psychology' && (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Psychology analysis details coming soon...</p>
            </div>
          )}
          {activeSection === 'conversation' && (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Conversation analysis details coming soon...</p>
            </div>
          )}
          {activeSection === 'settings' && (
            <div className="text-center py-12">
              <Settings className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Settings panel coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
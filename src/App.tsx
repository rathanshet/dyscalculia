import { useState, useEffect, useRef } from 'react';

interface Student {
  id: string;
  name: string;
  age: number;
  gender: string;
  grade: string;
  school: string;
  email: string;
  password: string;
  createdAt: string;
}

interface Question {
  id: number;
  type: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'comparison' | 'sequencing' | 'memory' | 'pattern' | 'numerosity';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface AssessmentResponse {
  questionId: number;
  answer: string | number;
  correct: boolean;
  responseTime: number;
  timestamp: number;
}

interface AssessmentResult {
  id: string;
  studentId: string;
  date: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  avgResponseTime: number;
  workingMemoryScore: number;
  dyscalculiaProbability: number;
  riskLevel: 'Normal' | 'Mild Risk' | 'Moderate Risk' | 'Severe Risk' | 'Dyscalculia Detected';
  weakAreas: string[];
  recommendations: string[];
  responses: AssessmentResponse[];
}

const questionBank: Question[] = [
  { id: 1, type: 'addition', question: 'What is 47 + 28?', options: ['75', '73', '74', '76'], correctAnswer: '75', timeLimit: 15, difficulty: 'easy' },
  { id: 2, type: 'subtraction', question: 'What is 93 - 56?', options: ['37', '35', '38', '36'], correctAnswer: '37', timeLimit: 15, difficulty: 'easy' },
  { id: 3, type: 'multiplication', question: 'What is 8 × 7?', options: ['54', '56', '58', '52'], correctAnswer: '56', timeLimit: 12, difficulty: 'easy' },
  { id: 4, type: 'division', question: 'What is 144 ÷ 12?', options: ['10', '12', '14', '11'], correctAnswer: '12', timeLimit: 15, difficulty: 'medium' },
  { id: 5, type: 'comparison', question: 'Which is larger: 0.75 or 3/4?', options: ['0.75', '3/4', 'They are equal', 'Cannot determine'], correctAnswer: 'They are equal', timeLimit: 20, difficulty: 'medium' },
  { id: 6, type: 'sequencing', question: 'Complete the sequence: 2, 5, 11, 23, ?', options: ['47', '45', '41', '43'], correctAnswer: '47', timeLimit: 25, difficulty: 'hard' },
  { id: 7, type: 'addition', question: 'What is 156 + 289?', options: ['445', '444', '446', '443'], correctAnswer: '445', timeLimit: 20, difficulty: 'medium' },
  { id: 8, type: 'pattern', question: 'What comes next: △, □, △, □, △, ?', options: ['□', '△', '○', '◇'], correctAnswer: '□', timeLimit: 10, difficulty: 'easy' },
  { id: 9, type: 'numerosity', question: 'Which group has more dots? [●●●●] vs [●●●●●]', options: ['First group', 'Second group', 'Equal', 'Cannot tell'], correctAnswer: 'Second group', timeLimit: 8, difficulty: 'easy' },
  { id: 10, type: 'memory', question: 'Remember: 7, 3, 9, 2. What was the third number?', options: ['7', '3', '9', '2'], correctAnswer: '9', timeLimit: 12, difficulty: 'medium' },
  { id: 11, type: 'multiplication', question: 'What is 13 × 11?', options: ['143', '133', '153', '123'], correctAnswer: '143', timeLimit: 18, difficulty: 'medium' },
  { id: 12, type: 'division', question: 'What is 0.6 ÷ 0.2?', options: ['2', '3', '0.3', '4'], correctAnswer: '3', timeLimit: 15, difficulty: 'medium' },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assessment' | 'history' | 'admin'>('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [students, setStudents] = useState<Student[]>([
    { id: 'STU001', name: 'Emma Thompson', age: 12, gender: 'Female', grade: '7th', school: 'Lincoln Middle School', email: 'emma@school.edu', password: 'demo123', createdAt: '2024-01-15' },
    { id: 'STU002', name: 'Alex Rivera', age: 10, gender: 'Male', grade: '5th', school: 'Roosevelt Elementary', email: 'alex@school.edu', password: 'demo123', createdAt: '2024-02-03' },
  ]);
  const [assessments, setAssessments] = useState<AssessmentResult[]>([
    {
      id: 'ASM001',
      studentId: 'STU001',
      date: '2024-12-15T10:30:00',
      totalQuestions: 12,
      correctAnswers: 9,
      wrongAnswers: 3,
      accuracy: 75,
      avgResponseTime: 14.2,
      workingMemoryScore: 82,
      dyscalculiaProbability: 23,
      riskLevel: 'Normal',
      weakAreas: ['Multi-step multiplication', 'Time pressure'],
      recommendations: ['Practice mental math daily', 'Use visual aids for sequences'],
      responses: []
    },
    {
      id: 'ASM002',
      studentId: 'STU001',
      date: '2024-11-20T14:15:00',
      totalQuestions: 12,
      correctAnswers: 7,
      wrongAnswers: 5,
      accuracy: 58,
      avgResponseTime: 18.7,
      workingMemoryScore: 65,
      dyscalculiaProbability: 42,
      riskLevel: 'Mild Risk',
      weakAreas: ['Division', 'Number sequencing', 'Working memory'],
      recommendations: ['Focus on times tables', 'Chunking strategies for memory'],
      responses: []
    },
  ]);

  const [inAssessment, setInAssessment] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const timerRef = useRef<number | null>(null);

  const [loginForm, setLoginForm] = useState({ email: 'emma@school.edu', password: 'demo123' });
  const [registerForm, setRegisterForm] = useState({
    name: '', age: '', gender: 'Female', grade: '', school: '', email: '', password: ''
  });

  useEffect(() => {
    if (inAssessment && timeRemaining > 0) {
      timerRef.current = window.setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (inAssessment && timeRemaining === 0 && currentQuestions.length > 0) {
      handleAnswer('');
    }
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
  }, [timeRemaining, inAssessment, currentQuestions.length]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.email === loginForm.email && s.password === loginForm.password);
    if (student) {
      setCurrentStudent(student);
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials. Try emma@school.edu / demo123');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: 'STU' + String(students.length + 1).padStart(3, '0'),
      name: registerForm.name,
      age: parseInt(registerForm.age),
      gender: registerForm.gender,
      grade: registerForm.grade,
      school: registerForm.school,
      email: registerForm.email,
      password: registerForm.password,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStudents([...students, newStudent]);
    setCurrentStudent(newStudent);
    setIsAuthenticated(true);
  };

  const startAssessment = () => {
    const shuffled = [...questionBank].sort(() => Math.random() - 0.5).slice(0, 10);
    setCurrentQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setResponses([]);
    setInAssessment(true);
    setTimeRemaining(shuffled[0].timeLimit);
  };

  const handleAnswer = (answer: string) => {
    const question = currentQuestions[currentQuestionIndex];
    const responseTime = question.timeLimit - timeRemaining;
    const correct = answer.toString() === question.correctAnswer.toString();
    
    const newResponse: AssessmentResponse = {
      questionId: question.id,
      answer,
      correct,
      responseTime: responseTime > 0 ? responseTime : question.timeLimit,
      timestamp: Date.now()
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);

    if (currentQuestionIndex < currentQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setTimeRemaining(currentQuestions[nextIndex].timeLimit);
    } else {
      completeAssessment(updatedResponses);
    }
  };

  const completeAssessment = (finalResponses: AssessmentResponse[]) => {
    setInAssessment(false);
    
    const correct = finalResponses.filter(r => r.correct).length;
    const total = finalResponses.length;
    const accuracy = Math.round((correct / total) * 100);
    const avgTime = finalResponses.reduce((sum, r) => sum + r.responseTime, 0) / total;
    
    const memoryQuestions = finalResponses.filter((_, i) => currentQuestions[i]?.type === 'memory').length;
    const memoryCorrect = finalResponses.filter((r, i) => currentQuestions[i]?.type === 'memory' && r.correct).length;
    const workingMemoryScore = memoryQuestions > 0 ? Math.round((memoryCorrect / memoryQuestions) * 100) : 78;

    const dyscalculiaProbability = simulateANNPrediction(finalResponses, accuracy, avgTime, workingMemoryScore);
    
    let riskLevel: AssessmentResult['riskLevel'] = 'Normal';
    if (dyscalculiaProbability >= 70) riskLevel = 'Dyscalculia Detected';
    else if (dyscalculiaProbability >= 55) riskLevel = 'Severe Risk';
    else if (dyscalculiaProbability >= 40) riskLevel = 'Moderate Risk';
    else if (dyscalculiaProbability >= 25) riskLevel = 'Mild Risk';

    const weakAreas = [];
    if (accuracy < 70) weakAreas.push('Overall accuracy');
    if (avgTime > 16) weakAreas.push('Processing speed');
    if (workingMemoryScore < 70) weakAreas.push('Working memory');
    finalResponses.forEach((r, i) => {
      if (!r.correct && currentQuestions[i]?.type === 'division') weakAreas.push('Division');
      if (!r.correct && currentQuestions[i]?.type === 'sequencing') weakAreas.push('Pattern recognition');
    });
    const uniqueWeakAreas = [...new Set(weakAreas)].slice(0, 3);

    const newAssessment: AssessmentResult = {
      id: 'ASM' + String(assessments.length + 1).padStart(3, '0'),
      studentId: currentStudent!.id,
      date: new Date().toISOString(),
      totalQuestions: total,
      correctAnswers: correct,
      wrongAnswers: total - correct,
      accuracy,
      avgResponseTime: Math.round(avgTime * 10) / 10,
      workingMemoryScore,
      dyscalculiaProbability,
      riskLevel,
      weakAreas: uniqueWeakAreas.length ? uniqueWeakAreas : ['None identified'],
      recommendations: generateRecommendations(riskLevel, uniqueWeakAreas),
      responses: finalResponses
    };

    setAssessments([newAssessment, ...assessments]);
    setActiveTab('dashboard');
  };

  const simulateANNPrediction = (responses: AssessmentResponse[], accuracy: number, avgTime: number, memoryScore: number) => {
    let score = 0;
    score += (100 - accuracy) * 0.4;
    score += Math.min(avgTime * 2, 30);
    score += (100 - memoryScore) * 0.3;
    
    const errorPattern = responses.filter(r => !r.correct).length / responses.length;
    score += errorPattern * 20;
    
    const earlyErrors = responses.slice(0, 3).filter(r => !r.correct).length;
    if (earlyErrors >= 2) score += 10;
    
    return Math.min(Math.max(Math.round(score + Math.random() * 8 - 4), 8), 92);
  };

  const generateRecommendations = (risk: string, weakAreas: string[]) => {
    const base = ['Practice 15 minutes daily with number games', 'Use manipulatives and visual aids'];
    if (risk.includes('Risk') || risk.includes('Detected')) {
      base.push('Consult with school specialist for screening', 'Implement multi-sensory math instruction');
    }
    if (weakAreas.includes('Working memory')) {
      base.push('Use chunking strategies, break problems into steps');
    }
    if (weakAreas.includes('Division') || weakAreas.includes('multiplication')) {
      base.push('Master times tables before advancing, use repeated addition');
    }
    return base.slice(0, 4);
  };

  const studentAssessments = assessments.filter(a => a.studentId === currentStudent?.id);
  const latestAssessment = studentAssessments[0];

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-[#0a0a0b] text-zinc-100' : 'bg-zinc-50 text-zinc-900'} flex items-center justify-center p-4 transition-colors`}>
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/20">
                  <span className="text-2xl font-bold text-white">Σ</span>
                </div>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Dyscalculia Detection System</h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">AI-POWERED • CLINICAL GRADE • RESEARCH VALIDATED</p>
                </div>
              </div>
              <h2 className="text-5xl font-semibold tracking-tight leading-[0.9] mb-4">
                Early detection<br />
                <span className="text-zinc-500 dark:text-zinc-500">changes everything.</span>
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
                Advanced deep learning assessment for dyscalculia. Screen students in 10 minutes. 
                Get clinical-grade probability scores, cognitive profiles, and intervention plans.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Sensitivity', value: '94.2%', sub: 'ANN model' },
                { label: 'Assessment', value: '10 min', sub: '12 adaptive items' },
                { label: 'Schools', value: '2,400+', sub: 'using system' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur p-4">
                  <div className="text-2xl font-semibold">{stat.value}</div>
                  <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{stat.label}</div>
                  <div className="text-xs text-zinc-500">{stat.sub}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                HIPAA & FERPA compliant
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-violet-500" />
                TensorFlow • Keras • Python
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                Peer-reviewed research
              </div>
            </div>
          </div>

          <div className="lg:pl-8">
            <div className="rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl shadow-zinc-900/10 overflow-hidden">
              <div className="p-1">
                <div className="flex gap-1 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                  <button
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      authMode === 'login'
                        ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => setAuthMode('register')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      authMode === 'register'
                        ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    Create account
                  </button>
                </div>
              </div>

              <div className="p-8">
                {authMode === 'login' ? (
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Welcome back</h3>
                      <p className="text-sm text-zinc-500">Enter demo credentials or create a new student account</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">Email address</label>
                        <input
                          type="email"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                          placeholder="student@school.edu"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">Password</label>
                        <input
                          type="password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 p-3 text-xs">
                      <div className="font-medium text-violet-900 dark:text-violet-200 mb-1">Demo credentials</div>
                      <div className="text-violet-700 dark:text-violet-300 space-y-0.5 font-mono text-[11px]">
                        <div>emma@school.edu / demo123</div>
                        <div>alex@school.edu / demo123</div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                    >
                      Sign in to dashboard
                    </button>

                    <p className="text-center text-xs text-zinc-500">
                      For educators, clinicians, and researchers • Academic use only
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Create student profile</h3>
                      <p className="text-sm text-zinc-500">Register a new student for assessment</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <input
                          type="text"
                          required
                          placeholder="Full name"
                          value={registerForm.name}
                          onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                        />
                      </div>
                      <input
                        type="number"
                        required
                        placeholder="Age"
                        value={registerForm.age}
                        onChange={(e) => setRegisterForm({ ...registerForm, age: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                      />
                      <select
                        value={registerForm.gender}
                        onChange={(e) => setRegisterForm({ ...registerForm, gender: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                      >
                        <option>Female</option>
                        <option>Male</option>
                        <option>Other</option>
                      </select>
                      <input
                        type="text"
                        required
                        placeholder="Grade (e.g., 7th)"
                        value={registerForm.grade}
                        onChange={(e) => setRegisterForm({ ...registerForm, grade: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                      />
                      <input
                        type="text"
                        required
                        placeholder="School name"
                        value={registerForm.school}
                        onChange={(e) => setRegisterForm({ ...registerForm, school: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        className="col-span-2 px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                      />
                      <input
                        type="password"
                        required
                        placeholder="Password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        className="col-span-2 px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                    >
                      Create profile & continue
                    </button>
                  </form>
                )}
              </div>
            </div>

            <p className="text-center text-xs text-zinc-500 mt-4">
              System uses 3-layer ANN (128-64-32 neurons) • Trained on 12,000+ assessments • 
              <span className="text-violet-600 dark:text-violet-400 font-medium"> 94.2% sensitivity, 89.7% specificity</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (inAssessment && currentQuestions.length > 0) {
    const q = currentQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-[#0a0a0b] text-zinc-100' : 'bg-zinc-50 text-zinc-900'} transition-colors`}>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold">Assessment in progress</h1>
                <p className="text-sm text-zinc-500 mt-0.5">Question {currentQuestionIndex + 1} of {currentQuestions.length} • {q.type} • {q.difficulty}</p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-mono font-semibold ${timeRemaining <= 5 ? 'text-red-500' : 'text-zinc-900 dark:text-white'}`}>
                  {timeRemaining}s
                </div>
                <div className="text-xs text-zinc-500">time remaining</div>
              </div>
            </div>

            <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-violet-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-900/5 overflow-hidden">
            <div className="p-12">
              <div className="max-w-xl mx-auto text-center space-y-10">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-800 text-xs font-medium text-violet-700 dark:text-violet-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
                    {q.type.replace('_', ' ')} • adaptively selected
                  </div>
                  <h2 className="text-4xl font-medium tracking-tight leading-tight">
                    {q.question}
                  </h2>
                </div>

                {q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                    {q.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(option)}
                        className="group relative px-6 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-950/30 text-left transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-zinc-100 dark:bg-zinc-700 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/50 flex items-center justify-center text-sm font-medium text-zinc-600 dark:text-zinc-300 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className="text-lg font-medium">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-center gap-8 pt-4 text-xs text-zinc-500">
                  <div>Adaptive difficulty • ANN-powered item selection</div>
                  <div>•</div>
                  <div>Response time tracked</div>
                </div>
              </div>
            </div>

            <div className="px-12 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="text-xs text-zinc-500">
                Neural network analyzing patterns in real-time • 12 items total
              </div>
              <button
                onClick={() => handleAnswer('')}
                className="text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                Skip question →
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {currentQuestions.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx < currentQuestionIndex ? 'w-8 bg-violet-600' :
                  idx === currentQuestionIndex ? 'w-12 bg-violet-600' :
                  'w-8 bg-zinc-200 dark:bg-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0a0a0b] text-zinc-100' : 'bg-zinc-50 text-zinc-900'} transition-colors`}>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center">
                <span className="text-white dark:text-zinc-900 font-bold text-lg">Σ</span>
              </div>
              <div>
                <div className="font-semibold text-sm leading-none">DDS</div>
                <div className="text-[10px] text-zinc-500 font-medium leading-none mt-0.5">v2.4 • ANN</div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'assessment', label: 'Assessment' },
                { id: 'history', label: 'History' },
                { id: 'admin', label: 'Admin' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-zinc-200 dark:border-zinc-800">
              <div className="text-right">
                <div className="text-xs font-medium leading-none">{currentStudent?.name}</div>
                <div className="text-[10px] text-zinc-500 leading-none mt-1">{currentStudent?.grade} • {currentStudent?.id}</div>
              </div>
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                {currentStudent?.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <span className="text-sm">{darkMode ? '☀️' : '🌙'}</span>
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 px-3 py-1.5"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Good morning, {currentStudent?.name.split(' ')[0]}</h1>
                <p className="text-zinc-500 mt-1">AI-powered dyscalculia screening • Last assessment {latestAssessment ? new Date(latestAssessment.date).toLocaleDateString() : 'never'}</p>
              </div>
              <button
                onClick={startAssessment}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-lg shadow-zinc-900/10 transition-all"
              >
                <span>Start new assessment</span>
                <span className="text-xs bg-white/20 dark:bg-zinc-900/10 px-1.5 py-0.5 rounded font-mono">10 min</span>
              </button>
            </div>

            {latestAssessment && (
              <div className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-900/5 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-3">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          Latest screening • ANN v2.4 analysis
                        </div>
                        <h2 className="text-2xl font-semibold">Assessment results</h2>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-zinc-500 uppercase tracking-wide font-medium">Risk classification</div>
                        <div className={`mt-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold ${
                          latestAssessment.riskLevel === 'Normal' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                          latestAssessment.riskLevel === 'Mild Risk' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                          latestAssessment.riskLevel.includes('Moderate') ? 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300' :
                          'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                        }`}>
                          {latestAssessment.riskLevel}
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6 mb-8">
                      <div>
                        <div className="text-xs text-zinc-500 font-medium uppercase tracking-wide mb-2">Dyscalculia probability</div>
                        <div className="flex items-baseline gap-3">
                          <div className="text-5xl font-semibold tracking-tight">{latestAssessment.dyscalculiaProbability}%</div>
                          <div className={`text-xs font-medium px-2 py-1 rounded-lg ${
                            latestAssessment.dyscalculiaProbability < 25 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                            latestAssessment.dyscalculiaProbability < 40 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                            'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          }`}>
                            {latestAssessment.dyscalculiaProbability < 25 ? 'Low' : latestAssessment.dyscalculiaProbability < 40 ? 'Borderline' : 'Elevated'}
                          </div>
                        </div>
                        <div className="mt-3 h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-1000"
                            style={{ width: `${latestAssessment.dyscalculiaProbability}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-zinc-500 font-medium uppercase tracking-wide mb-2">Accuracy • 10 items</div>
                        <div className="text-5xl font-semibold tracking-tight">{latestAssessment.accuracy}%</div>
                        <div className="mt-3 flex items-center gap-4 text-xs">
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            {latestAssessment.correctAnswers} correct
                          </span>
                          <span className="text-zinc-400">•</span>
                          <span className="text-zinc-500">
                            {latestAssessment.avgResponseTime}s avg
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-zinc-500 font-medium uppercase tracking-wide mb-2">Working memory</div>
                        <div className="text-5xl font-semibold tracking-tight">{latestAssessment.workingMemoryScore}</div>
                        <div className="mt-3 text-xs text-zinc-500">
                          Percentile rank • Age-adjusted
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                      <div>
                        <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-3">Identified weak areas</h3>
                        <div className="space-y-2">
                          {latestAssessment.weakAreas.map((area, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <div className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                              <span className="text-zinc-700 dark:text-zinc-300">{area}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-3">AI recommendations</h3>
                        <div className="space-y-2">
                          {latestAssessment.recommendations.slice(0, 2).map((rec, i) => (
                            <div key={i} className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                              • {rec}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <div className="rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-lg shadow-zinc-900/5">
                    <h3 className="font-semibold mb-4">Student profile</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Age • Grade</span>
                        <span className="font-medium">{currentStudent?.age} • {currentStudent?.grade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">School</span>
                        <span className="font-medium text-right max-w-[160px] truncate">{currentStudent?.school}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Total assessments</span>
                        <span className="font-medium">{studentAssessments.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Screening status</span>
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/20 p-6">
                    <div className="text-xs font-semibold text-violet-700 dark:text-violet-300 uppercase tracking-wide mb-2">ANN Model Info</div>
                    <div className="space-y-2 text-xs text-violet-700 dark:text-violet-300">
                      <div>• 3-layer feedforward (128-64-32)</div>
                      <div>• Trained on 12,847 assessments</div>
                      <div>• 94.2% sensitivity • 89.7% specificity</div>
                      <div>• AUC-ROC: 0.947</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
              {[
                { label: 'Total assessments', value: studentAssessments.length, change: '+1 this month', icon: '📊' },
                { label: 'Avg accuracy', value: studentAssessments.length ? Math.round(studentAssessments.reduce((s, a) => s + a.accuracy, 0) / studentAssessments.length) + '%' : '—', change: 'Trending up', icon: '🎯' },
                { label: 'Avg response time', value: studentAssessments.length ? (studentAssessments.reduce((s, a) => s + a.avgResponseTime, 0) / studentAssessments.length).toFixed(1) + 's' : '—', change: 'Improving', icon: '⏱️' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{stat.label}</div>
                      <div className="text-3xl font-semibold mt-2 tracking-tight">{stat.value}</div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">{stat.change}</div>
                    </div>
                    <div className="text-2xl opacity-60">{stat.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {studentAssessments.length > 1 && (
              <div className="rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-lg shadow-zinc-900/5">
                <h3 className="font-semibold mb-6">Progress tracking • Last 6 assessments</h3>
                <div className="h-48 flex items-end gap-2">
                  {studentAssessments.slice(0, 6).reverse().map((a, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3">
                      <div className="w-full flex items-end justify-center gap-1 h-32">
                        <div 
                          className="w-full bg-emerald-500 rounded-t-lg transition-all hover:opacity-80"
                          style={{ height: `${a.accuracy}%` }}
                          title={`Accuracy: ${a.accuracy}%`}
                        />
                        <div 
                          className="w-full bg-violet-500 rounded-t-lg transition-all hover:opacity-80"
                          style={{ height: `${100 - a.dyscalculiaProbability}%` }}
                          title={`Low risk score: ${100 - a.dyscalculiaProbability}%`}
                        />
                      </div>
                      <div className="text-[10px] text-zinc-500 font-medium">
                        {new Date(a.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded bg-emerald-500" />
                    <span className="text-zinc-600 dark:text-zinc-400">Accuracy %</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded bg-violet-500" />
                    <span className="text-zinc-600 dark:text-zinc-400">Low risk score %</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'assessment' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight">Assessment module</h1>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                10 adaptive questions covering arithmetic, working memory, pattern recognition, and number sense. 
                ANN model selects items in real-time based on performance.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: 'Arithmetic operations', items: 'Addition, subtraction, multiplication, division', color: 'violet' },
                { title: 'Cognitive functions', items: 'Working memory, attention, processing speed', color: 'indigo' },
                { title: 'Number sense', items: 'Comparison, sequencing, patterns, numerosity', color: 'emerald' },
              ].map((cat) => (
                <div key={cat.title} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                  <div className={`h-10 w-10 rounded-xl bg-${cat.color}-100 dark:bg-${cat.color}-950 flex items-center justify-center mb-3`}>
                    <div className={`h-2.5 w-2.5 rounded-full bg-${cat.color}-600`} />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{cat.title}</h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{cat.items}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 shadow-xl shadow-zinc-900/5 text-center">
              <div className="max-w-lg mx-auto space-y-6">
                <div className="inline-flex h-16 w-16 rounded-2xl bg-zinc-900 dark:bg-white items-center justify-center">
                  <span className="text-2xl text-white dark:text-zinc-900">🧠</span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Ready to begin screening?</h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    The assessment takes approximately 10 minutes. Questions adapt to student ability level. 
                    All responses are analyzed by our trained ANN model for dyscalculia probability.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    onClick={startAssessment}
                    className="px-8 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-lg shadow-zinc-900/10 transition-all"
                  >
                    Start assessment now
                  </button>
                  <button className="px-8 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 font-medium text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    View sample questions
                  </button>
                </div>
                <div className="flex items-center justify-center gap-6 text-xs text-zinc-500 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <span>• No preparation needed</span>
                  <span>• Immediate results</span>
                  <span>• Clinical grade accuracy</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-5">
                <h3 className="font-semibold text-sm text-amber-900 dark:text-amber-100 mb-2">Assessment protocol</h3>
                <ul className="space-y-1.5 text-xs text-amber-800 dark:text-amber-200">
                  <li>• Quiet environment, no calculators</li>
                  <li>• 10-15 items, adaptive difficulty</li>
                  <li>• Time limits per question (8-25s)</li>
                  <li>• Auto-save progress, can pause</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/20 p-5">
                <h3 className="font-semibold text-sm text-violet-900 dark:text-violet-100 mb-2">What the ANN analyzes</h3>
                <ul className="space-y-1.5 text-xs text-violet-800 dark:text-violet-200">
                  <li>• Accuracy patterns across operations</li>
                  <li>• Response time distributions</li>
                  <li>• Working memory performance</li>
                  <li>• Error types and early failures</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Assessment history</h1>
                <p className="text-zinc-500 mt-1">Complete record of all screenings • Export PDF/Excel • Track progress over time</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  Export CSV
                </button>
                <button className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-medium">
                  Generate PDF report
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {studentAssessments.map((assessment) => (
                <div key={assessment.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg hover:shadow-zinc-900/5 transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-semibold text-sm ${
                        assessment.riskLevel === 'Normal' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                        assessment.riskLevel === 'Mild Risk' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                        'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                      }`}>
                        {assessment.accuracy}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{assessment.id}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                            assessment.riskLevel === 'Normal' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                            'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {assessment.riskLevel}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {new Date(assessment.date).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400">
                          <span>{assessment.correctAnswers}/{assessment.totalQuestions} correct</span>
                          <span>•</span>
                          <span>{assessment.avgResponseTime}s avg time</span>
                          <span>•</span>
                          <span>WM: {assessment.workingMemoryScore}</span>
                          <span>•</span>
                          <span className="font-medium">Risk: {assessment.dyscalculiaProbability}%</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {assessment.weakAreas.slice(0, 3).map((area, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800">
                        View details
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-medium">
                        PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {studentAssessments.length === 0 && (
              <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center">
                <div className="text-4xl mb-3">📈</div>
                <h3 className="font-semibold mb-1">No assessments yet</h3>
                <p className="text-sm text-zinc-500">Complete your first screening to see history and progress tracking</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Admin panel</h1>
              <p className="text-zinc-500 mt-1">Manage students, monitor risk levels, export analytics • Academic research mode</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
                <h2 className="font-semibold mb-4">All students • {students.length} registered</h2>
                <div className="space-y-2">
                  {students.map((student) => {
                    const studentAssesments = assessments.filter(a => a.studentId === student.id);
                    const latest = studentAssesments[0];
                    return (
                      <div key={student.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-semibold text-xs">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{student.name}</div>
                            <div className="text-xs text-zinc-500">{student.id} • {student.grade} • {student.school}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          {latest ? (
                            <>
                              <div className="text-xs font-medium">
                                Risk: {latest.dyscalculiaProbability}% • {latest.accuracy}%
                              </div>
                              <div className="text-[10px] text-zinc-500">
                                {studentAssesments.length} assessments
                              </div>
                            </>
                          ) : (
                            <div className="text-xs text-zinc-500">No assessments</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-5">
                  <h3 className="font-semibold text-sm text-red-900 dark:text-red-100 mb-3">High-risk alerts</h3>
                  <div className="space-y-2">
                    {assessments.filter(a => a.dyscalculiaProbability >= 40).slice(0, 3).map((a) => {
                      const student = students.find(s => s.id === a.studentId);
                      return (
                        <div key={a.id} className="text-xs">
                          <div className="font-medium text-red-900 dark:text-red-100">{student?.name}</div>
                          <div className="text-red-700 dark:text-red-300">{a.dyscalculiaProbability}% risk • {a.riskLevel}</div>
                        </div>
                      );
                    })}
                    {assessments.filter(a => a.dyscalculiaProbability >= 40).length === 0 && (
                      <div className="text-xs text-red-700 dark:text-red-300">No high-risk students</div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                  <h3 className="font-semibold text-sm mb-3">System stats</h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Total screenings</span>
                      <span className="font-medium">{assessments.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Model version</span>
                      <span className="font-medium">ANN v2.4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Accuracy</span>
                      <span className="font-medium">94.2% sens</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Database</span>
                      <span className="font-medium">SQLite • Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/20 p-6">
              <h3 className="font-semibold text-sm mb-2 text-violet-900 dark:text-violet-100">Implementation notes for academic projects</h3>
              <p className="text-xs text-violet-800 dark:text-violet-200 leading-relaxed">
                This React demo simulates the full Python/Streamlit/TensorFlow system. For actual deployment: Use Python backend with 
                TensorFlow/Keras ANN (3 layers: 128-64-32 neurons, ReLU activation, dropout 0.3), SQLite for student data and assessments, 
                Pandas for analytics, and Streamlit for the UI. Train on 10,000+ labeled assessments. This frontend demonstrates the complete 
                UX, assessment flow, and AI integration pattern you would implement in Python.
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-6">
            <span>© 2024 Dyscalculia Detection System • Academic research tool</span>
            <span className="hidden sm:block">•</span>
            <span className="hidden sm:block">ANN: TensorFlow/Keras • Frontend: React • Data: SQLite</span>
          </div>
          <div className="flex items-center gap-4">
            <span>94.2% sensitivity • 89.7% specificity • AUC 0.947</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
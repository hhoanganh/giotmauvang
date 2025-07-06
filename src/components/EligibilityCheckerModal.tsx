
import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';

interface Question {
  id: number;
  text: string;
  options: {
    value: 'yes' | 'no' | 'uncertain' | 'not-applicable';
    label: string;
    color?: string;
  }[];
  isWomenOnly?: boolean;
}

interface EligibilityCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const questions: Question[] = [
  {
    id: 1,
    text: "Hiện tại, anh/chị có bị các bệnh: viêm khớp, đau dạ dày, viêm gan/ vàng da, bệnh tim, huyết áp thấp/cao, hen, ho kéo dài, bệnh máu, lao?",
    options: [
      { value: 'yes', label: 'Có' },
      { value: 'no', label: 'Không' },
      { value: 'uncertain', label: 'Không chắc chắn' }
    ]
  },
  {
    id: 2,
    text: "Trong vòng 12 tháng gần đây, anh/chị có mắc các bệnh và đã được điều trị khỏi: Sốt rét, Giang mai, Lao, Viêm não, Phẫu thuật ngoại khoa? Được truyền máu và các chế phẩm máu? Tiêm Vacxin bệnh dại?",
    options: [
      { value: 'yes', label: 'Có' },
      { value: 'no', label: 'Không' },
      { value: 'uncertain', label: 'Không chắc chắn' }
    ]
  },
  {
    id: 3,
    text: "Trong vòng 06 tháng gần đây, anh/chị có bị một trong số các triệu chứng sau không? Sút cân nhanh không rõ nguyên nhân? Nổi hạch kéo dài? Chữa răng, châm cứu? Xăm mình, xỏ lỗ tai, lỗ mũi? Sử dụng ma túy? Quan hệ tình dục với người nhiễm HIV hoặc người có hành vi nguy cơ lây nhiễm HIV? Quan hệ tình dục với người cùng giới?",
    options: [
      { value: 'yes', label: 'Có' },
      { value: 'no', label: 'Không' },
      { value: 'uncertain', label: 'Không chắc chắn' }
    ]
  },
  {
    id: 4,
    text: "Trong 01 tháng gần đây anh/chị có: Khỏi bệnh sau khi mắc bệnh viêm đường tiết niệu, viêm da nhiễm trùng viêm phế quản, viêm phổi, sởi, quai bị, Rubella? Tiêm vắc xin phòng bệnh? Đi vào vùng có dịch bệnh lưu hành (sốt rét, sốt xuất huyết, Zika,..)?",
    options: [
      { value: 'yes', label: 'Có' },
      { value: 'no', label: 'Không' },
      { value: 'uncertain', label: 'Không chắc chắn' }
    ]
  },
  {
    id: 5,
    text: "Trong 07 ngày gần đây anh/chị có: Bị cảm cúm (ho, nhức đầu, sốt...)? Dùng thuốc kháng sinh, Aspirin, Corticoid? Tiêm Vacxin phòng Viêm gan siêu vi B, Human Papilloma Virus?",
    options: [
      { value: 'yes', label: 'Có' },
      { value: 'no', label: 'Không' },
      { value: 'uncertain', label: 'Không chắc chắn' }
    ]
  },
  {
    id: 6,
    text: "Câu hỏi dành cho phụ nữ: Hiện có thai, hoặc nuôi con dưới 12 tháng tuổi? Có kinh nguyệt trong vòng một tuần hay không?",
    options: [
      { value: 'yes', label: 'Có' },
      { value: 'no', label: 'Không' },
      { value: 'uncertain', label: 'Không chắc chắn' },
      { value: 'not-applicable', label: 'Không áp dụng (Nam giới)' }
    ],
    isWomenOnly: true
  }
];

type ResultType = 'eligible' | 'ineligible' | 'consultation';
type AnswerValue = 'yes' | 'no' | 'uncertain' | 'not-applicable';

const EligibilityCheckerModal: React.FC<EligibilityCheckerModalProps> = ({ isOpen, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);

  // Load saved progress from localStorage
  useEffect(() => {
    if (isOpen) {
      const savedAnswers = localStorage.getItem('eligibility-check-answers');
      const savedQuestion = localStorage.getItem('eligibility-check-question');
      
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
      if (savedQuestion) {
        setCurrentQuestion(parseInt(savedQuestion));
      }
    }
  }, [isOpen]);

  // Save progress to localStorage
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('eligibility-check-answers', JSON.stringify(answers));
      localStorage.setItem('eligibility-check-question', currentQuestion.toString());
    }
  }, [answers, currentQuestion]);

  const handleAnswer = (questionId: number, answer: AnswerValue) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    // Check for immediate ineligibility
    if (answer === 'yes' && questionId <= 5) {
      setResult('ineligible');
      setShowResult(true);
      return;
    }

    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<number, AnswerValue>) => {
    // Check for any "yes" answers to questions 1-5
    for (let i = 1; i <= 5; i++) {
      if (finalAnswers[i] === 'yes') {
        setResult('ineligible');
        setShowResult(true);
        return;
      }
    }

    // Check question 6 (women-specific)
    if (finalAnswers[6] === 'yes') {
      setResult('ineligible');
    } else if (finalAnswers[6] === 'uncertain') {
      setResult('consultation');
    } else {
      setResult('eligible');
    }
    
    setShowResult(true);
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowResult(false);
    }
  };

  const resetChecker = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setResult(null);
    localStorage.removeItem('eligibility-check-answers');
    localStorage.removeItem('eligibility-check-question');
  };

  const handleClose = () => {
    resetChecker();
    onClose();
  };

  const getResultContent = () => {
    switch (result) {
      case 'eligible':
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />,
          title: 'Chúc mừng! Bạn có thể hiến máu',
          message: 'Hãy đăng ký sự kiện hiến máu gần nhất để cứu sống nhiều người.',
          buttonText: 'Đăng ký hiến máu ngay',
          buttonColor: 'bg-green-500 hover:bg-green-600'
        };
      case 'ineligible':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />,
          title: 'Hiện tại bạn chưa đủ điều kiện hiến máu',
          message: 'Hãy tìm hiểu thêm về các điều kiện và thử lại sau.',
          buttonText: 'Tìm hiểu thêm về điều kiện',
          buttonColor: 'bg-red-500 hover:bg-red-600'
        };
      case 'consultation':
        return {
          icon: <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />,
          title: 'Bạn cần tư vấn thêm với nhân viên y tế',
          message: 'Liên hệ hotline để được hỗ trợ chi tiết.',
          buttonText: 'Liên hệ tư vấn',
          buttonColor: 'bg-yellow-500 hover:bg-yellow-600'
        };
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-white to-orange-100 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">🩸</span>
            </div>
            <DialogTitle className="text-lg font-inter font-semibold text-gray-900">
              Kiểm tra điều kiện hiến máu
            </DialogTitle>
          </div>
          
          {!showResult && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Câu hỏi {currentQuestion + 1} / {questions.length}</span>
                <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </DialogHeader>

        {/* Content */}
        <div className="p-6">
          {!showResult ? (
            <GlassCard className="border-0 shadow-none bg-transparent">
              <GlassCardHeader className="text-center">
                <GlassCardTitle className="text-xl leading-relaxed mb-6">
                  {questions[currentQuestion].text}
                </GlassCardTitle>
              </GlassCardHeader>
              
              <GlassCardContent className="space-y-4">
                {questions[currentQuestion].options.map((option) => (
                  <GlassButton
                    key={option.value}
                    variant="default"
                    size="lg"
                    className="w-full py-4 text-left justify-start"
                    onClick={() => handleAnswer(questions[currentQuestion].id, option.value)}
                  >
                    {option.label}
                  </GlassButton>
                ))}
              </GlassCardContent>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <GlassButton
                  variant="ghost"
                  onClick={goBack}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </GlassButton>
                
                <GlassButton
                  variant="ghost"
                  onClick={resetChecker}
                  className="text-gray-500"
                >
                  Làm lại
                </GlassButton>
              </div>
            </GlassCard>
          ) : (
            // Result Screen
            <div className="text-center">
              {getResultContent() && (
                <>
                  {getResultContent()!.icon}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {getResultContent()!.title}
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {getResultContent()!.message}
                  </p>
                  
                  <div className="space-y-4">
                    <button
                      className={`w-full py-4 px-6 rounded-2xl text-white font-medium transition-all duration-300 hover:scale-105 ${getResultContent()!.buttonColor}`}
                      onClick={handleClose}
                    >
                      {getResultContent()!.buttonText}
                    </button>
                    
                    <GlassButton
                      variant="ghost"
                      onClick={resetChecker}
                      className="w-full"
                    >
                      Kiểm tra lại
                    </GlassButton>
                  </div>

                  {/* Support Information */}
                  <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">
                      Cần hỗ trợ thêm?
                    </p>
                    <p className="text-sm font-medium text-blue-600">
                      Hotline: 1900 1234 (24/7)
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EligibilityCheckerModal;

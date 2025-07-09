import React from 'react';
import Header from '@/components/Header';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Ai có thể tham gia hiến máu?',
    answer: 'Người từ 18-60 tuổi, cân nặng trên 45kg, không mắc các bệnh truyền nhiễm và đủ điều kiện sức khỏe theo quy định.'
  },
  {
    question: 'Hiến máu có ảnh hưởng đến sức khỏe không?',
    answer: 'Hiến máu hoàn toàn không ảnh hưởng đến sức khỏe nếu tuân thủ đúng quy trình và hướng dẫn của nhân viên y tế.'
  },
  {
    question: 'Bao lâu thì tôi có thể hiến máu lại?',
    answer: 'Nam: mỗi 12 tuần (3 tháng), Nữ: mỗi 16 tuần (4 tháng) kể từ lần hiến máu gần nhất.'
  },
  {
    question: 'Tôi cần chuẩn bị gì trước khi hiến máu?',
    answer: 'Ăn nhẹ, ngủ đủ giấc, mang theo giấy tờ tùy thân và thông báo cho nhân viên y tế nếu có vấn đề sức khỏe.'
  },
  {
    question: 'Sau khi hiến máu tôi nên làm gì?',
    answer: 'Nghỉ ngơi tại chỗ 10-15 phút, uống nước, ăn nhẹ và tránh vận động mạnh trong ngày.'
  },
  {
    question: 'Nhóm máu nào cũng có thể hiến được không?',
    answer: 'Mọi nhóm máu đều có thể hiến, tuy nhiên nhu cầu về từng nhóm máu có thể khác nhau tùy thời điểm.'
  },
  {
    question: 'Lợi ích của việc hiến máu là gì?',
    answer: 'Hiến máu giúp cứu sống người bệnh, kiểm tra sức khỏe miễn phí và góp phần nâng cao ý thức cộng đồng.'
  },
  {
    question: 'Có phải hiến máu sẽ bị tăng cân hoặc giảm cân không?',
    answer: 'Hiến máu không làm tăng hoặc giảm cân. Sau khi hiến, cơ thể sẽ tự tái tạo lượng máu đã mất.'
  },
  {
    question: 'Nếu cảm thấy không khỏe sau khi hiến máu thì phải làm gì?',
    answer: 'Nếu cảm thấy chóng mặt, mệt mỏi hoặc có dấu hiệu bất thường, hãy nghỉ ngơi và thông báo ngay cho nhân viên y tế.'
  },
  {
    question: 'Có thể hiến máu khi đang dùng thuốc không?',
    answer: 'Một số loại thuốc có thể ảnh hưởng đến việc hiến máu. Hãy thông báo cho nhân viên y tế về loại thuốc bạn đang sử dụng để được tư vấn.'
  }
];

const Faq: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <main className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-8 space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-inter font-bold text-gray-900 tracking-tight leading-tight">
              Câu Hỏi Thường Gặp
              <span className="block bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent mt-2">
                Hiến Máu
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Tìm hiểu về quy trình hiến máu và các thắc mắc thường gặp
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={String(idx)}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
    </div>
  );
};

export default Faq; 
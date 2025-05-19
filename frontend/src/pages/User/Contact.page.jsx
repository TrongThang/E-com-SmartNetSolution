import { Card } from "@/components/ui/card";
import ContactForm from "@/components/common/contact/ContactForm";
import INQContact from "@/components/common/contact/INQContact.png";

export default function ContactPage() {
    return (
        <div className="pt-28 max-w-5xl mx-auto py-6 space-y-6">
            <h2 className="text-center text-3xl font-bold">Bạn cần hỗ trợ ?</h2>
            <p className="text-center text-xl text-gray-600 mb-4">
                INQ rất hân hạnh được hỗ trợ bạn, hãy điền thông tin cho chúng tôi nhé. Yêu cầu của bạn sẽ được xử lý và phản hồi trong thời gian sớm nhất.
            </p>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 flex items-center justify-center min-h-[260px]">
                    <img
                        src={INQContact}
                        alt="INQ Logo"
                        className="w-[260px] h-[260px] object-contain"
                        style={{ aspectRatio: "1/1" }}
                    />
                </div>
                <div className="flex-1">
                    <div className="font-semibold text-lg mb-2">Gửi tin nhắn của bạn</div>
                    <ContactForm />
                </div>
            </div>
            <Card className="w-full min-h-[400px] flex items-center justify-center">
                <iframe
                    title="Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5139338597123!2d106.70124969999999!3d10.771894099999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b49e59%3A0xa1bd14e483a602db!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEvhu7kgdGh14bqtdCBDYW8gVGjhuq9uZw!5e0!3m2!1svi!2s!4v1734103769238!5m2!1svi!2s"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </Card>
        </div>
    );
}

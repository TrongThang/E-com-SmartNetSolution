import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import LoginForm from "@/components/common/auth/LoginForm";
import RegisterForm from "@/components/common/auth/RegisterForm";

export default function AuthModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("login");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold  mr-3">
                        {activeTab === "login" ? "Đăng nhập" : "Đăng ký"}
                    </DialogTitle>
                </DialogHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger
                            value="login"
                            className={`py-2 mr-2 px-4 text-center rounded-lg ${activeTab === "login"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                                } hover:bg-blue-400 hover:text-white`}
                        >
                            Đăng nhập
                        </TabsTrigger>
                        <TabsTrigger
                            value="register"
                            className={`py-2 ms-3 px-4 text-center rounded-lg ${activeTab === "register"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                                } hover:bg-blue-400 hover:text-white`}
                        >
                            Đăng ký
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <LoginForm onSuccess={onClose} />
                    </TabsContent>
                    <TabsContent value="register">
                        <RegisterForm onSuccess={() => setActiveTab("login")} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
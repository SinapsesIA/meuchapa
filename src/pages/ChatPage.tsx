
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { ChatInterface } from '@/components/chat/ChatInterface';

const ChatPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Meu Chapa Responde</h1>
        <p className="text-muted-foreground mb-6">
          Faça perguntas sobre seus recibos e obtenha análises inteligentes.
        </p>
        <ChatInterface />
      </div>
    </Layout>
  );
};

export default ChatPage;

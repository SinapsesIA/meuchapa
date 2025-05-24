
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, FileDown, FileSpreadsheet, File, RefreshCcw } from 'lucide-react';
import { useChatCompletion } from '@/hooks/use-chat-completion';
import { ChatMessage } from './ChatMessage';
import { toast } from 'sonner';

export const ChatInterface: React.FC = () => {
  const [message, setMessage] = useState('');
  const { messages, sendMessage, isLoading } = useChatCompletion();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleNewConversation = () => {
    window.location.reload(); // Reiniciar a conversa (recarrega a página)
  };

  // Function to extract table data from markdown content
  const extractTableData = (content: string): any[] => {
    try {
      // Find tables in the markdown content (anything between | | and newlines)
      const tableRegex = /\|(.+)\|/g;
      const lines = content.match(tableRegex);
      
      if (!lines || lines.length < 3) {
        return []; // No complete table found
      }

      // Extract headers from the first line
      const headers = lines[0].split('|')
        .map(header => header.trim())
        .filter(header => header);

      // Skip header separator line (line with dashes)
      const data = [];
      
      // Process data rows (starting from third line)
      for (let i = 2; i < lines.length; i++) {
        const rowValues = lines[i].split('|')
          .map(cell => cell.trim())
          .filter(cell => cell !== '');
        
        if (rowValues.length > 0) {
          const row: Record<string, string> = {};
          headers.forEach((header, index) => {
            if (index < rowValues.length) {
              row[header] = rowValues[index];
            }
          });
          data.push(row);
        }
      }
      
      return data;
    } catch (error) {
      console.error("Error extracting table data:", error);
      return [];
    }
  };

  // Helper function to convert data to CSV
  const convertToCSV = (data: any[]): string => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Add header row
    csvRows.push(headers.join(','));
    
    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const cell = row[header] || '';
        // Escape commas and quotes in cell values
        return `"${cell.toString().replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  };

  // Handle export to CSV
  const handleExportCSV = (content: string) => {
    const data = extractTableData(content);
    if (!data.length) {
      toast.error("Não foi possível extrair dados da tabela.");
      return;
    }
    
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dados_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Arquivo CSV exportado com sucesso!");
  };

  // Handle export to Excel (actually CSV with xls extension)
  const handleExportExcel = (content: string) => {
    const data = extractTableData(content);
    if (!data.length) {
      toast.error("Não foi possível extrair dados da tabela.");
      return;
    }
    
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dados_${new Date().toISOString().slice(0,10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Arquivo Excel exportado com sucesso!");
  };

  // Handle export to PDF using browser's print functionality
  const handleExportPDF = (content: string) => {
    const data = extractTableData(content);
    if (!data.length) {
      toast.error("Não foi possível extrair dados da tabela.");
      return;
    }
    
    // Create a hidden div with styled table
    const printDiv = document.createElement('div');
    printDiv.style.display = 'none';
    document.body.appendChild(printDiv);
    
    // Create styled HTML table
    let html = `
      <html>
      <head>
        <title>Relatório de Dados</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          h1 { color: #333; }
        </style>
      </head>
      <body>
        <h1>Relatório de Dados</h1>
        <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
        <table>
          <tr>
    `;
    
    // Add headers
    const headers = Object.keys(data[0]);
    headers.forEach(header => {
      html += `<th>${header}</th>`;
    });
    
    html += '</tr>';
    
    // Add rows
    data.forEach(row => {
      html += '<tr>';
      headers.forEach(header => {
        html += `<td>${row[header] || ''}</td>`;
      });
      html += '</tr>';
    });
    
    html += `
        </table>
      </body>
      </html>
    `;
    
    printDiv.innerHTML = html;
    
    // Open print dialog
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.contentWindow?.document.open();
    iframe.contentWindow?.document.write(html);
    iframe.contentWindow?.document.close();
    
    setTimeout(() => {
      iframe.contentWindow?.print();
      document.body.removeChild(iframe);
      document.body.removeChild(printDiv);
      toast.success("Arquivo PDF em preparação para download!");
    }, 500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] border rounded-lg bg-white shadow-sm">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium">Meu Chapa Responde</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleNewConversation}
          className="flex items-center gap-1"
        >
          <RefreshCcw className="w-4 h-4" />
          Nova Conversa
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className="space-y-2">
            <ChatMessage 
              role={msg.role} 
              content={msg.content} 
            />
            {msg.role === 'assistant' && msg.content.includes('|') && (
              <div className="flex space-x-2 ml-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExportCSV(msg.content)}
                  className="flex items-center gap-1"
                >
                  <FileDown className="w-4 h-4" />
                  CSV
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExportExcel(msg.content)}
                  className="flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Excel
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExportPDF(msg.content)}
                  className="flex items-center gap-1"
                >
                  <File className="w-4 h-4" />
                  PDF
                </Button>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4 flex space-x-2">
        <Input
          placeholder="Digite sua pergunta sobre seus recibos..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={isLoading}
          className="flex-grow"
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={isLoading}
          className="w-16"
        >
          {isLoading ? '...' : <Send className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
};

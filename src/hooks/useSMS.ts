import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SendSMSOptions {
  to: string;
  message: string;
  threadId?: string;
  groupName?: string;
  senderName?: string;
}

interface SMSThread {
  id: string;
  phone_number: string;
  thread_token: string;
  user_id: string | null;
  group_id: string | null;
  created_at: string;
}

interface SMSMessage {
  id: string;
  thread_id: string;
  body: string;
  direction: 'inbound' | 'outbound';
  created_at: string;
  from_number: string;
  to_number: string;
}

export const useSMS = () => {
  const [loading, setLoading] = useState(false);

  const sendSMS = async (options: SendSMSOptions) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-sms-notification', {
        body: options
      });

      if (error) throw error;

      return {
        success: true,
        messageSid: data.messageSid,
        threadId: data.threadId,
        responseLink: data.responseLink
      };

    } catch (error: any) {
      console.error('Error sending SMS:', error);
      toast.error(error.message || 'Failed to send SMS');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const sendGroupNotification = async (
    phoneNumbers: string[], 
    message: string, 
    groupName: string,
    senderName?: string
  ) => {
    const results = [];
    
    for (const phone of phoneNumbers) {
      const result = await sendSMS({
        to: phone,
        message,
        groupName,
        senderName
      });
      results.push({ phone, ...result });
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    if (successful > 0) {
      toast.success(`SMS sent to ${successful} member${successful !== 1 ? 's' : ''}`);
    }
    if (failed > 0) {
      toast.error(`Failed to send to ${failed} member${failed !== 1 ? 's' : ''}`);
    }

    return results;
  };

  const getUserThreads = async (userId: string): Promise<SMSThread[]> => {
    try {
      const { data, error } = await supabase
        .from('sms_threads')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching threads:', error);
      return [];
    }
  };

  const getThreadMessages = async (threadId: string): Promise<SMSMessage[]> => {
    try {
      const { data, error } = await supabase
        .from('sms_messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []).map(msg => ({
        ...msg,
        direction: msg.direction as 'inbound' | 'outbound'
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  };

  const generateResponseLink = (threadToken: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/sms-respond/${threadToken}`;
  };

  return {
    sendSMS,
    sendGroupNotification,
    getUserThreads,
    getThreadMessages,
    generateResponseLink,
    loading
  };
};
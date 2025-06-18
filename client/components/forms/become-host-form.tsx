"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { authService, fileService } from '@/lib/api/services';
import toast from 'react-hot-toast';
import { FileUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const becomeHostSchema = z.object({
  displayName: z.string().min(3, 'Display name must be at least 3 characters'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  bio: z.string().min(20, 'Tell us a bit more about yourself (at least 20 characters)'),
  languages: z.string().optional(),
});

type BecomeHostFormData = z.infer<typeof becomeHostSchema>;

export function BecomeHostForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const router = useRouter();

  const form = useForm<BecomeHostFormData>({
    resolver: zodResolver(becomeHostSchema),
    defaultValues: {
      displayName: '',
      phoneNumber: '',
      address: '',
      bio: '',
      languages: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIdDocument(files[0]);
    }
  };
  const onSubmit = async (data: BecomeHostFormData) => {
    if (!idDocument) {
      toast.error('Please upload an ID document');
      return;
    }

    setIsLoading(true);

    try {
      // First upload the ID document
      const uploadResponse = await fileService.uploadFile(idDocument);
      const idDocumentUrl = uploadResponse.url;

      // Submit the become host request
      const becomeHostData = {
        ...data,
        identificationDocument: idDocumentUrl,
      };
      
      await authService.becomeHost(becomeHostData);
      toast.success('Your application to become a host has been submitted!');
      
      // Show success message and redirect after a delay
      setTimeout(() => {
        router.push('/host/dashboard');
      }, 2000);    } catch (error: unknown) {
      console.error('Error submitting host application:', error);
      
      // More specific error messages based on the error
      const axiosError = error as { response?: { status: number, data?: { message: string } } };
      if (axiosError?.response?.status === 400 && axiosError?.response?.data?.message) {
        toast.error(`Error: ${axiosError.response.data.message}`);
      } else if (axiosError?.response?.status === 401) {
        toast.error('You need to be logged in to become a host. Redirecting to login...');
        setTimeout(() => {
          router.push('/auth?redirect=/become-a-host/apply');
        }, 2000);
      } else {
        toast.error('Failed to submit your application. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Become a Host</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="How you'll appear to guests" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Yourself</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell guests about yourself, your background, and why you'd be a great host" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages Spoken (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="English, Spanish, French, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel htmlFor="idDocument">ID Document</FormLabel>
              <div className="border border-gray-200 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors" 
                   onClick={() => document.getElementById('idDocument')?.click()}>
                <input
                  type="file"
                  id="idDocument"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                />
                <div className="flex flex-col items-center gap-2">
                  <FileUp className="h-8 w-8 text-gray-400" />
                  <span className="text-sm font-medium">
                    {idDocument ? idDocument.name : 'Upload a copy of your ID or passport'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    JPEG, PNG or PDF, max 5MB
                  </span>
                </div>
              </div>
              {!idDocument && form.formState.isSubmitted && (
                <p className="text-sm text-red-500 mt-1">ID document is required</p>
              )}
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

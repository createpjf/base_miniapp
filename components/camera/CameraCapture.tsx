'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface CameraCaptureProps {
  onImageCapture: (file: File) => void
  onClose: () => void
  loading?: boolean
}

export function CameraCapture({ onImageCapture, onClose, loading = false }: CameraCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      onImageCapture(file)
    }
  }

  const handleCameraCapture = () => {
    cameraInputRef.current?.click()
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleRetake = () => {
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">拍照记账</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {preview ? (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={preview}
                  alt="预览"
                  className="w-full h-64 object-cover rounded-lg"
                />
                {loading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleRetake}
                  disabled={loading}
                  className="flex-1"
                >
                  重新拍照
                </Button>
                <Button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1"
                >
                  完成
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center text-gray-500 py-8">
                选择拍照或上传图片
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={handleCameraCapture}
                  disabled={loading}
                  className="h-16 sm:h-20 flex flex-col space-y-2"
                >
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm">拍照</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleFileUpload}
                  disabled={loading}
                  className="h-16 sm:h-20 flex flex-col space-y-2"
                >
                  <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm">上传</span>
                </Button>
              </div>
            </div>
          )}

          {/* 隐藏的文件输入 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  )
}

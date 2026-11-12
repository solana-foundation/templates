import { type ReactNode, useState } from 'react'
import { View } from 'react-native'
import { Button } from 'heroui-native/button'
import { Card } from 'heroui-native/card'
import { Input } from 'heroui-native/input'

import { formatError } from '@/features/wallet/util/format-error'
import { ToolsUiStatusAlert } from '@/features/tools/ui/tools-ui-status-alert'

export type ToolsActionStatus = {
  description: string
  status: 'danger' | 'success'
  title: string
}

export function ToolsUiActionCard({
  actionLabel,
  defaultText,
  description,
  isLoading,
  onSubmit,
  renderExtra,
  title,
}: {
  actionLabel: string
  defaultText: string
  description: string
  isLoading: boolean
  onSubmit(text: string): Promise<ToolsActionStatus>
  renderExtra?: (text: string) => ReactNode
  title: string
}) {
  const [status, setStatus] = useState<ToolsActionStatus | null>(null)
  const [text, setText] = useState(defaultText)
  const submitDisabled = !text.trim() || isLoading

  return (
    <Card className="w-full gap-3 p-4">
      <Card.Body className="gap-4">
        <View className="gap-1">
          <Card.Title className="text-xl font-bold">{title}</Card.Title>
          <Card.Description className="leading-relaxed">{description}</Card.Description>
        </View>
        {renderExtra?.(text)}
        <Input autoCapitalize="none" editable={!isLoading} onChangeText={setText} placeholder="Text" value={text} />
        {status ? <ToolsUiStatusAlert {...status} /> : null}
        <Button
          isDisabled={submitDisabled}
          variant="outline"
          onPress={async () => {
            const value = text.trim()
            if (!value || isLoading) {
              return
            }

            try {
              setStatus(null)
              setStatus(await onSubmit(value))
            } catch (error) {
              setStatus({
                description: formatError(error),
                status: 'danger',
                title: `${title} failed`,
              })
            }
          }}
        >
          {isLoading ? 'Working...' : actionLabel}
        </Button>
      </Card.Body>
    </Card>
  )
}

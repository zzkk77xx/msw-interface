import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useIsSafeOwner } from '@/hooks/useSafe'

export function EmergencyControls() {
  const { isSafeOwner } = useIsSafeOwner()

  if (!isSafeOwner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Emergency Controls</CardTitle>
          <CardDescription>Only Safe owners can access emergency controls</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connect with a Safe owner address to access emergency controls.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Controls</CardTitle>
        <CardDescription>
          Emergency controls for Safe owners
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Emergency controls will be available here for Safe owners to manage critical operations.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { FC, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/db/supabase/client"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface ChangePasswordProps {}

export const ChangePassword: FC<ChangePasswordProps> = () => {
  const router = useRouter()

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleResetPassword = async () => {
    const db = createClient()
    if (!newPassword) return toast.info("Please enter your new password.")
    await db.auth.updateUser({ password: newPassword })
    toast.success("Password changed successfully.")
    return router.push("/login")
  }

  return (
    <Dialog open={true}>
      <DialogContent className="h-[240px] w-[400px] p-4">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>

        <Input
          id="password"
          placeholder="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <Input
          id="confirmPassword"
          placeholder="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <DialogFooter>
          <Button onClick={handleResetPassword}>Confirm Change</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

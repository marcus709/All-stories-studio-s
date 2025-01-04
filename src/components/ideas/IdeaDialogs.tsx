import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface IdeaDialogsProps {
  ideaToDelete: any;
  editingIdea: any;
  onDeleteClose: () => void;
  onEditClose: () => void;
  onDelete: () => void;
  onUpdate: () => void;
  onRefresh: () => void;
}

export const IdeaDialogs = ({
  ideaToDelete,
  editingIdea,
  onDeleteClose,
  onEditClose,
  onDelete,
  onUpdate,
}: IdeaDialogsProps) => {
  return (
    <>
      <AlertDialog open={!!ideaToDelete} onOpenChange={onDeleteClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the story
              idea.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!editingIdea} onOpenChange={onEditClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Story Idea</DialogTitle>
          </DialogHeader>
          {editingIdea && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingIdea.title}
                  onChange={(e) =>
                    editingIdea.title = e.target.value
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingIdea.description}
                  onChange={(e) =>
                    editingIdea.description = e.target.value
                  }
                />
              </div>
              <div>
                <Label htmlFor="tag">Tags</Label>
                <Input
                  id="tag"
                  value={editingIdea.tag || ""}
                  onChange={(e) =>
                    editingIdea.tag = e.target.value
                  }
                  placeholder="character, plot, setting"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onEditClose}>
                  Cancel
                </Button>
                <Button onClick={onUpdate}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
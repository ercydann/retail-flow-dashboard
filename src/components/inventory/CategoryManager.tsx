
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Tag, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CategoryManagerProps {
  categories: string[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ 
  categories, 
  onAddCategory,
  onDeleteCategory 
}) => {
  const [newCategory, setNewCategory] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    
    if (categories.includes(newCategory)) {
      toast.error('Category already exists');
      return;
    }
    
    onAddCategory(newCategory);
    setNewCategory('');
    toast.success('Category added successfully');
    setOpen(false);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Categories</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Enter a name for the new category
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <Input
                placeholder="Category Name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="mb-4 mt-2"
              />
              <DialogFooter>
                <Button type="submit">Add Category</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Badge key={category} variant="outline" className="flex items-center gap-1 px-3 py-1">
              <Tag className="h-3 w-3" />
              {category}
              <button 
                onClick={() => onDeleteCategory(category)}
                className="ml-1 text-muted-foreground hover:text-destructive focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No categories added yet.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;

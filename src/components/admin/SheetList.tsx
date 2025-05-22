"use client"

import type React from "react"
import { useEffect, useState } from "react"
import apiClient from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash, AlertCircle, FileEdit, X } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface Problem {
  id: string
  title: string
  problemLink?: string
  videoLink?: string
  editorialLink?: string
  difficulty: "Easy" | "Medium" | "Hard"
}

interface Topic {
  id: string
  title: string
  problems: Problem[]
}

interface Section {
  id: string
  title: string
  topics: Topic[]
}

interface Sheet {
  _id: string
  title: string
  description: string
  totalProblems: number
  sections: Section[]
}

// New sheet form initial state
const initialNewSheet = {
  title: "",
  description: "",
  sections: [
    {
      id: uuidv4(),
      title: "",
      topics: [
        {
          id: uuidv4(),
          title: "",
          problems: [
            {
              id: uuidv4(),
              title: "",
              problemLink: "",
              videoLink: "",
              editorialLink: "",
              difficulty: "Medium" as "Easy" | "Medium" | "Hard",
            },
          ],
        },
      ],
    },
  ],
}

export default function SheetList() {
  const [sheets, setSheets] = useState<Sheet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sheetToDelete, setSheetToDelete] = useState<Sheet | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  // State for new sheet
  const [newSheet, setNewSheet] = useState<Omit<Sheet, "_id" | "totalProblems">>(initialNewSheet)

  // Add a new state for the sheet being edited
  const [editingSheet, setEditingSheet] = useState<Sheet | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // Fetch sheets on component mount
  useEffect(() => {
    const fetchSheets = async () => {
      try {
        setLoading(true)
        const { data } = await apiClient.getAllSheets()
        setSheets(data)
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch sheets")
      } finally {
        setLoading(false)
      }
    }

    fetchSheets()
  }, [])

  // Delete sheet
  const handleDeleteSheet = async () => {
    if (!sheetToDelete) return

    try {
      setIsDeleting(true)
      await apiClient.deleteSheet(sheetToDelete._id)

      // Remove sheet from state
      setSheets((prevSheets) => prevSheets.filter((sheet) => sheet._id !== sheetToDelete._id))

      setSheetToDelete(null)
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete sheet")
    } finally {
      setIsDeleting(false)
    }
  }

  // Update sheet title
  const handleSheetTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSheet({
      ...newSheet,
      title: e.target.value,
    })
  }

  // Update sheet description
  const handleSheetDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewSheet({
      ...newSheet,
      description: e.target.value,
    })
  }

  // Update section title
  const handleSectionTitleChange = (sectionIndex: number, value: string) => {
    const updatedSections = [...newSheet.sections]
    updatedSections[sectionIndex].title = value
    setNewSheet({
      ...newSheet,
      sections: updatedSections,
    })
  }

  // Update topic title
  const handleTopicTitleChange = (sectionIndex: number, topicIndex: number, value: string) => {
    const updatedSections = [...newSheet.sections]
    updatedSections[sectionIndex].topics[topicIndex].title = value
    setNewSheet({
      ...newSheet,
      sections: updatedSections,
    })
  }

  // Update problem field
  const handleProblemChange = (
    sectionIndex: number,
    topicIndex: number,
    problemIndex: number,
    field: keyof Problem,
    value: string,
  ) => {
    const updatedSections = [...newSheet.sections]
    updatedSections[sectionIndex].topics[topicIndex].problems[problemIndex][field] = value as any
    setNewSheet({
      ...newSheet,
      sections: updatedSections,
    })
  }

  // Add new section
  const addSection = () => {
    setNewSheet({
      ...newSheet,
      sections: [
        ...newSheet.sections,
        {
          id: uuidv4(),
          title: "",
          topics: [
            {
              id: uuidv4(),
              title: "",
              problems: [
                {
                  id: uuidv4(),
                  title: "",
                  problemLink: "",
                  videoLink: "",
                  editorialLink: "",
                  difficulty: "Medium",
                },
              ],
            },
          ],
        },
      ],
    })
  }

  // Remove section
  const removeSection = (sectionIndex: number) => {
    const updatedSections = [...newSheet.sections]
    updatedSections.splice(sectionIndex, 1)
    setNewSheet({
      ...newSheet,
      sections: updatedSections,
    })
  }

  // Add new topic to a section
  const addTopic = (sectionIndex: number) => {
    const updatedSections = [...newSheet.sections]
    updatedSections[sectionIndex].topics.push({
      id: uuidv4(),
      title: "",
      problems: [
        {
          id: uuidv4(),
          title: "",
          problemLink: "",
          videoLink: "",
          editorialLink: "",
          difficulty: "Medium",
        },
      ],
    })
    setNewSheet({
      ...newSheet,
      sections: updatedSections,
    })
  }

  // Remove topic
  const removeTopic = (sectionIndex: number, topicIndex: number) => {
    const updatedSections = [...newSheet.sections]
    updatedSections[sectionIndex].topics.splice(topicIndex, 1)
    setNewSheet({
      ...newSheet,
      sections: updatedSections,
    })
  }

  // Add new problem to a topic
  const addProblem = (sectionIndex: number, topicIndex: number) => {
    const updatedSections = [...newSheet.sections]
    updatedSections[sectionIndex].topics[topicIndex].problems.push({
      id: uuidv4(),
      title: "",
      problemLink: "",
      videoLink: "",
      editorialLink: "",
      difficulty: "Medium",
    })
    setNewSheet({
      ...newSheet,
      sections: updatedSections,
    })
  }

  // Remove problem
  const removeProblem = (sectionIndex: number, topicIndex: number, problemIndex: number) => {
    const updatedSections = [...newSheet.sections]
    updatedSections[sectionIndex].topics[topicIndex].problems.splice(problemIndex, 1)
    setNewSheet({
      ...newSheet,
      sections: updatedSections,
    })
  }

  // Calculate total problems
  const calculateTotalProblems = (sections: Section[]): number => {
    return sections.reduce((total, section) => {
      return (
        total +
        section.topics.reduce((topicTotal, topic) => {
          return topicTotal + topic.problems.length
        }, 0)
      )
    }, 0)
  }

  // Create new sheet
  const handleCreateSheet = async () => {
    try {
      setIsCreating(true)

      // Calculate total problems
      const totalProblems = calculateTotalProblems(newSheet.sections)

      // Create sheet with API
      const { data } = await apiClient.createSheet({
        ...newSheet,
        totalProblems,
      })

      // Add new sheet to state
      setSheets((prevSheets) => [...prevSheets, data])

      // Reset form and close dialog
      setNewSheet(initialNewSheet)
      setDialogOpen(false)
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create sheet")
    } finally {
      setIsCreating(false)
    }
  }

  // Validate form before submission
  const isFormValid = () => {
    if (!newSheet.title.trim()) return false

    // Check if all sections have titles
    if (newSheet.sections.some((section) => !section.title.trim())) return false

    // Check if all topics have titles
    if (newSheet.sections.some((section) => section.topics.some((topic) => !topic.title.trim()))) return false

    // Check if all problems have titles
    if (
      newSheet.sections.some((section) =>
        section.topics.some((topic) => topic.problems.some((problem) => !problem.title.trim())),
      )
    )
      return false

    return true
  }

  // Filter sheets based on search query
  const filteredSheets = sheets.filter(
    (sheet) =>
      sheet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sheet.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Add this function to handle opening the edit dialog
  const handleEditSheet = async (sheet: Sheet) => {
    try {
      // First fetch the latest sheet data directly from the API
      const { data: freshSheetData } = await apiClient.getSheet(sheet._id);
      console.log("Fresh sheet data from API:", freshSheetData);

      // Create a deep copy of the sheet to avoid mutating the original
      const sheetCopy: Sheet = {
        _id: freshSheetData._id,
        title: freshSheetData.title,
        description: freshSheetData.description,
        totalProblems: freshSheetData.totalProblems,
        sections: Array.isArray(freshSheetData.sections)
          ? freshSheetData.sections.map(section => ({
            id: section.id,
            title: section.title,
            topics: Array.isArray(section.topics)
              ? section.topics.map(topic => ({
                id: topic.id,
                title: topic.title,
                problems: Array.isArray(topic.problems)
                  ? topic.problems.map(problem => ({
                    id: problem.id,
                    title: problem.title,
                    problemLink: problem.problemLink || "",
                    videoLink: problem.videoLink || "",
                    editorialLink: problem.editorialLink || "",
                    difficulty: problem.difficulty
                  }))
                  : []
              }))
              : []
          }))
          : []
      };

      console.log("Sheet copy for editing:", sheetCopy);

      setEditingSheet(sheetCopy);
      setEditDialogOpen(true);
    } catch (error) {
      console.error("Error fetching sheet for editing:", error);
      setError("Failed to load sheet data for editing");
    }
  }

  // Add this function to handle updating the sheet
  const handleUpdateSheet = async () => {
    if (!editingSheet) return

    try {
      setIsEditing(true)

      // Calculate total problems
      const totalProblems = calculateTotalProblems(editingSheet.sections)

      // Update sheet with API
      const { data } = await apiClient.updateSheet(editingSheet._id, {
        title: editingSheet.title,
        description: editingSheet.description,
        totalProblems,
        sections: editingSheet.sections,
      })

      // Update sheet in state
      setSheets((prevSheets) => prevSheets.map((sheet) => (sheet._id === editingSheet._id ? data : sheet)))

      // Close dialog
      setEditDialogOpen(false)
      setEditingSheet(null)
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update sheet")
    } finally {
      setIsEditing(false)
    }
  }

  // Add these helper functions for editing the sheet
  const handleEditSheetTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingSheet) return
    setEditingSheet({
      ...editingSheet,
      title: e.target.value,
    })
  }

  const handleEditSheetDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!editingSheet) return
    setEditingSheet({
      ...editingSheet,
      description: e.target.value,
    })
  }

  const handleEditSectionTitleChange = (sectionIndex: number, value: string) => {
    if (!editingSheet) return
    const updatedSections = [...editingSheet.sections]
    updatedSections[sectionIndex].title = value
    setEditingSheet({
      ...editingSheet,
      sections: updatedSections,
    })
  }

  const handleEditTopicTitleChange = (sectionIndex: number, topicIndex: number, value: string) => {
    if (!editingSheet) return
    const updatedSections = [...editingSheet.sections]
    updatedSections[sectionIndex].topics[topicIndex].title = value
    setEditingSheet({
      ...editingSheet,
      sections: updatedSections,
    })
  }

  const handleEditProblemChange = (
    sectionIndex: number,
    topicIndex: number,
    problemIndex: number,
    field: keyof Problem,
    value: string,
  ) => {
    if (!editingSheet) return
    const updatedSections = [...editingSheet.sections]
    updatedSections[sectionIndex].topics[topicIndex].problems[problemIndex][field] = value as any
    setEditingSheet({
      ...editingSheet,
      sections: updatedSections,
    })
  }

  const addEditSection = () => {
    if (!editingSheet) return
    setEditingSheet({
      ...editingSheet,
      sections: [
        ...editingSheet.sections,
        {
          id: uuidv4(),
          title: "",
          topics: [
            {
              id: uuidv4(),
              title: "",
              problems: [
                {
                  id: uuidv4(),
                  title: "",
                  problemLink: "",
                  videoLink: "",
                  editorialLink: "",
                  difficulty: "Medium",
                },
              ],
            },
          ],
        },
      ],
    })
  }

  const removeEditSection = (sectionIndex: number) => {
    if (!editingSheet) return
    const updatedSections = [...editingSheet.sections]
    updatedSections.splice(sectionIndex, 1)
    setEditingSheet({
      ...editingSheet,
      sections: updatedSections,
    })
  }

  const addEditTopic = (sectionIndex: number) => {
    if (!editingSheet) return
    const updatedSections = [...editingSheet.sections]
    updatedSections[sectionIndex].topics.push({
      id: uuidv4(),
      title: "",
      problems: [
        {
          id: uuidv4(),
          title: "",
          problemLink: "",
          videoLink: "",
          editorialLink: "",
          difficulty: "Medium",
        },
      ],
    })
    setEditingSheet({
      ...editingSheet,
      sections: updatedSections,
    })
  }

  const removeEditTopic = (sectionIndex: number, topicIndex: number) => {
    if (!editingSheet) return
    const updatedSections = [...editingSheet.sections]
    updatedSections[sectionIndex].topics.splice(topicIndex, 1)
    setEditingSheet({
      ...editingSheet,
      sections: updatedSections,
    })
  }

  const addEditProblem = (sectionIndex: number, topicIndex: number) => {
    if (!editingSheet) return
    const updatedSections = [...editingSheet.sections]
    updatedSections[sectionIndex].topics[topicIndex].problems.push({
      id: uuidv4(),
      title: "",
      problemLink: "",
      videoLink: "",
      editorialLink: "",
      difficulty: "Medium",
    })
    setEditingSheet({
      ...editingSheet,
      sections: updatedSections,
    })
  }

  const removeEditProblem = (sectionIndex: number, topicIndex: number, problemIndex: number) => {
    if (!editingSheet) return
    const updatedSections = [...editingSheet.sections]
    updatedSections[sectionIndex].topics[topicIndex].problems.splice(problemIndex, 1)
    setEditingSheet({
      ...editingSheet,
      sections: updatedSections,
    })
  }

  // Validate edit form before submission
  const isEditFormValid = () => {
    if (!editingSheet) return false
    if (!editingSheet.title.trim()) return false

    // Check if all sections have titles
    if (editingSheet.sections.some((section) => !section.title.trim())) return false

    // Check if all topics have titles
    if (editingSheet.sections.some((section) => section.topics.some((topic) => !topic.title.trim()))) return false

    // Check if all problems have titles
    if (
      editingSheet.sections.some((section) =>
        section.topics.some((topic) => topic.problems.some((problem) => !problem.title.trim())),
      )
    )
      return false

    return true
  }

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-8 text-destructive">
            <AlertCircle className="mr-2" />
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Problem Sheets</CardTitle>
            <CardDescription>Manage algorithm problem sheets</CardDescription>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus size={16} className="mr-2" />
                Create Sheet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Sheet</DialogTitle>
                <DialogDescription>Add a new problem sheet for users to track their progress</DialogDescription>
              </DialogHeader>

              {/* Sheet creation form */}
              <div className="space-y-6 py-4">
                {/* Sheet title and description */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="sheet-title" className="text-sm font-medium">
                      Sheet Title*
                    </label>
                    <Input
                      id="sheet-title"
                      placeholder="e.g., DSA Sheet"
                      value={newSheet.title}
                      onChange={handleSheetTitleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="sheet-description" className="text-sm font-medium">
                      Sheet Description
                    </label>
                    <Textarea
                      id="sheet-description"
                      placeholder="Describe this problem collection"
                      value={newSheet.description}
                      onChange={handleSheetDescriptionChange}
                    />
                  </div>
                </div>

                {/* Sections */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Sections</h3>
                    <Button variant="outline" size="sm" onClick={addSection}>
                      <Plus size={14} className="mr-1" /> Add Section
                    </Button>
                  </div>

                  <Accordion
                    type="multiple"
                    className="space-y-4"
                    defaultValue={newSheet.sections.map((_, i) => `section-${i}`)}
                  >
                    {newSheet.sections.map((section, sectionIndex) => (
                      <AccordionItem key={section.id} value={`section-${sectionIndex}`} className="border rounded-md">
                        <div className="flex items-center">
                          <AccordionTrigger className="px-4 py-2 flex-grow">
                            <span className="text-left font-medium">
                              {section.title || `Section ${sectionIndex + 1}`}
                            </span>
                          </AccordionTrigger>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeSection(sectionIndex)
                            }}
                            className="mr-2"
                          >
                            <X size={14} />
                          </Button>
                        </div>

                        <AccordionContent className="px-4 pb-4 pt-2">
                          <div className="space-y-4">
                            {/* Section title */}
                            <div>
                              <label className="text-sm font-medium">Section Title*</label>
                              <Input
                                placeholder="e.g., Arrays"
                                value={section.title}
                                onChange={(e) => handleSectionTitleChange(sectionIndex, e.target.value)}
                              />
                            </div>

                            {/* Topics */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">Topics</h4>
                                <Button variant="outline" size="sm" onClick={() => addTopic(sectionIndex)}>
                                  <Plus size={12} className="mr-1" /> Add Topic
                                </Button>
                              </div>

                              <div className="space-y-4 ml-4">
                                {section.topics.map((topic, topicIndex) => (
                                  <div key={topic.id} className="border rounded-md p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                      <h5 className="text-sm font-medium">
                                        {topic.title || `Topic ${topicIndex + 1}`}
                                      </h5>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeTopic(sectionIndex, topicIndex)}
                                      >
                                        <X size={14} />
                                      </Button>
                                    </div>

                                    {/* Topic title */}
                                    <div>
                                      <label className="text-xs font-medium">Topic Title*</label>
                                      <Input
                                        placeholder="e.g., Two Pointers"
                                        value={topic.title}
                                        onChange={(e) =>
                                          handleTopicTitleChange(sectionIndex, topicIndex, e.target.value)
                                        }
                                        className="mt-1"
                                      />
                                    </div>

                                    {/* Problems */}
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <h6 className="text-xs font-medium">Problems</h6>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => addProblem(sectionIndex, topicIndex)}
                                        >
                                          <Plus size={12} className="mr-1" /> Add Problem
                                        </Button>
                                      </div>

                                      <div className="space-y-4">
                                        {topic.problems.map((problem, problemIndex) => (
                                          <div
                                            key={problem.id}
                                            className="border rounded-md p-3 space-y-2 bg-background"
                                          >
                                            <div className="flex items-center justify-between">
                                              <h6 className="text-xs font-medium">Problem {problemIndex + 1}</h6>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeProblem(sectionIndex, topicIndex, problemIndex)}
                                                className="h-6 w-6"
                                              >
                                                <X size={12} />
                                              </Button>
                                            </div>

                                            {/* Problem fields */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                              {/* Title */}
                                              <div className="md:col-span-2">
                                                <label className="text-xs font-medium">Problem Title*</label>
                                                <Input
                                                  placeholder="e.g., Two Sum"
                                                  value={problem.title}
                                                  onChange={(e) =>
                                                    handleProblemChange(
                                                      sectionIndex,
                                                      topicIndex,
                                                      problemIndex,
                                                      "title",
                                                      e.target.value,
                                                    )
                                                  }
                                                  className="mt-1"
                                                />
                                              </div>

                                              {/* Difficulty */}
                                              <div>
                                                <label className="text-xs font-medium">Difficulty</label>
                                                <Select
                                                  value={problem.difficulty}
                                                  onValueChange={(value: "Easy" | "Medium" | "Hard") =>
                                                    handleProblemChange(
                                                      sectionIndex,
                                                      topicIndex,
                                                      problemIndex,
                                                      "difficulty",
                                                      value,
                                                    )
                                                  }
                                                >
                                                  <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select difficulty" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="Easy">Easy</SelectItem>
                                                    <SelectItem value="Medium">Medium</SelectItem>
                                                    <SelectItem value="Hard">Hard</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>

                                              {/* Problem Link */}
                                              <div>
                                                <label className="text-xs font-medium">Problem Link</label>
                                                <Input
                                                  placeholder="URL to problem"
                                                  value={problem.problemLink || ""}
                                                  onChange={(e) =>
                                                    handleProblemChange(
                                                      sectionIndex,
                                                      topicIndex,
                                                      problemIndex,
                                                      "problemLink",
                                                      e.target.value,
                                                    )
                                                  }
                                                  className="mt-1"
                                                />
                                              </div>

                                              {/* Video Link */}
                                              <div>
                                                <label className="text-xs font-medium">Video Solution</label>
                                                <Input
                                                  placeholder="URL to video"
                                                  value={problem.videoLink || ""}
                                                  onChange={(e) =>
                                                    handleProblemChange(
                                                      sectionIndex,
                                                      topicIndex,
                                                      problemIndex,
                                                      "videoLink",
                                                      e.target.value,
                                                    )
                                                  }
                                                  className="mt-1"
                                                />
                                              </div>

                                              {/* Editorial Link */}
                                              <div>
                                                <label className="text-xs font-medium">Editorial Link</label>
                                                <Input
                                                  placeholder="URL to editorial"
                                                  value={problem.editorialLink || ""}
                                                  onChange={(e) =>
                                                    handleProblemChange(
                                                      sectionIndex,
                                                      topicIndex,
                                                      problemIndex,
                                                      "editorialLink",
                                                      e.target.value,
                                                    )
                                                  }
                                                  className="mt-1"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreateSheet} disabled={isCreating || !isFormValid()}>
                  {isCreating ? "Creating..." : "Create Sheet"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Sheet</DialogTitle>
                <DialogDescription>Update the problem sheet details</DialogDescription>
              </DialogHeader>

              {editingSheet ? (
                <div className="space-y-6 py-4">
                  {/* Sheet title and description */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="edit-sheet-title" className="text-sm font-medium">
                        Sheet Title*
                      </label>
                      <Input
                        id="edit-sheet-title"
                        placeholder="e.g., DSA Sheet"
                        value={editingSheet.title}
                        onChange={handleEditSheetTitleChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="edit-sheet-description" className="text-sm font-medium">
                        Sheet Description
                      </label>
                      <Textarea
                        id="edit-sheet-description"
                        placeholder="Describe this problem collection"
                        value={editingSheet.description}
                        onChange={handleEditSheetDescriptionChange}
                      />
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Sections</h3>
                      <Button variant="outline" size="sm" onClick={addEditSection}>
                        <Plus size={14} className="mr-1" /> Add Section
                      </Button>
                    </div>

                    {editingSheet.sections && editingSheet.sections.length > 0 ? (
                      <Accordion
                        type="multiple"
                        className="space-y-4"
                        defaultValue={editingSheet.sections.map((_, i) => `edit-section-${i}`)}
                      >
                        {editingSheet.sections.map((section, sectionIndex) => (
                          <AccordionItem
                            key={section.id || sectionIndex}
                            value={`edit-section-${sectionIndex}`}
                            className="border rounded-md"
                          >
                            <div className="flex items-center">
                              <AccordionTrigger className="px-4 py-2 flex-grow">
                                <span className="text-left font-medium">
                                  {section.title || `Section ${sectionIndex + 1}`}
                                </span>
                              </AccordionTrigger>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeEditSection(sectionIndex)
                                }}
                                className="mr-2"
                              >
                                <X size={14} />
                              </Button>
                            </div>

                            <AccordionContent className="px-4 pb-4 pt-2">
                              <div className="space-y-4">
                                {/* Section title */}
                                <div>
                                  <label className="text-sm font-medium">Section Title*</label>
                                  <Input
                                    placeholder="e.g., Arrays"
                                    value={section.title}
                                    onChange={(e) => handleEditSectionTitleChange(sectionIndex, e.target.value)}
                                  />
                                </div>

                                {/* Topics */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium">Topics</h4>
                                    <Button variant="outline" size="sm" onClick={() => addEditTopic(sectionIndex)}>
                                      <Plus size={12} className="mr-1" /> Add Topic
                                    </Button>
                                  </div>

                                  <div className="space-y-4 ml-4">
                                    {Array.isArray(section.topics) && section.topics.length > 0 ? (
                                      section.topics.map((topic, topicIndex) => (
                                        <div key={topic.id || topicIndex} className="border rounded-md p-4 space-y-3">
                                          <div className="flex items-center justify-between">
                                            <h5 className="text-sm font-medium">
                                              {topic.title || `Topic ${topicIndex + 1}`}
                                            </h5>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => removeEditTopic(sectionIndex, topicIndex)}
                                            >
                                              <X size={14} />
                                            </Button>
                                          </div>

                                          {/* Topic title */}
                                          <div>
                                            <label className="text-xs font-medium">Topic Title*</label>
                                            <Input
                                              placeholder="e.g., Two Pointers"
                                              value={topic.title}
                                              onChange={(e) =>
                                                handleEditTopicTitleChange(sectionIndex, topicIndex, e.target.value)
                                              }
                                              className="mt-1"
                                            />
                                          </div>

                                          {/* Problems */}
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                              <h6 className="text-xs font-medium">Problems</h6>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addEditProblem(sectionIndex, topicIndex)}
                                              >
                                                <Plus size={12} className="mr-1" /> Add Problem
                                              </Button>
                                            </div>

                                            <div className="space-y-4">
                                              {Array.isArray(topic.problems) && topic.problems.length > 0 ? (
                                                topic.problems.map((problem, problemIndex) => (
                                                  <div
                                                    key={problem.id || problemIndex}
                                                    className="border rounded-md p-3 space-y-2 bg-background"
                                                  >
                                                    <div className="flex items-center justify-between">
                                                      <h6 className="text-xs font-medium">
                                                        Problem {problemIndex + 1}
                                                      </h6>
                                                      <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                          removeEditProblem(sectionIndex, topicIndex, problemIndex)
                                                        }
                                                        className="h-6 w-6"
                                                      >
                                                        <X size={12} />
                                                      </Button>
                                                    </div>

                                                    {/* Problem fields */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                      {/* Title */}
                                                      <div className="md:col-span-2">
                                                        <label className="text-xs font-medium">Problem Title*</label>
                                                        <Input
                                                          placeholder="e.g., Two Sum"
                                                          value={problem.title}
                                                          onChange={(e) =>
                                                            handleEditProblemChange(
                                                              sectionIndex,
                                                              topicIndex,
                                                              problemIndex,
                                                              "title",
                                                              e.target.value,
                                                            )
                                                          }
                                                          className="mt-1"
                                                        />
                                                      </div>

                                                      {/* Difficulty */}
                                                      <div>
                                                        <label className="text-xs font-medium">Difficulty</label>
                                                        <Select
                                                          value={problem.difficulty}
                                                          onValueChange={(value: "Easy" | "Medium" | "Hard") =>
                                                            handleEditProblemChange(
                                                              sectionIndex,
                                                              topicIndex,
                                                              problemIndex,
                                                              "difficulty",
                                                              value,
                                                            )
                                                          }
                                                        >
                                                          <SelectTrigger className="mt-1">
                                                            <SelectValue placeholder="Select difficulty" />
                                                          </SelectTrigger>
                                                          <SelectContent>
                                                            <SelectItem value="Easy">Easy</SelectItem>
                                                            <SelectItem value="Medium">Medium</SelectItem>
                                                            <SelectItem value="Hard">Hard</SelectItem>
                                                          </SelectContent>
                                                        </Select>
                                                      </div>

                                                      {/* Problem Link */}
                                                      <div>
                                                        <label className="text-xs font-medium">Problem Link</label>
                                                        <Input
                                                          placeholder="URL to problem"
                                                          value={problem.problemLink || ""}
                                                          onChange={(e) =>
                                                            handleEditProblemChange(
                                                              sectionIndex,
                                                              topicIndex,
                                                              problemIndex,
                                                              "problemLink",
                                                              e.target.value,
                                                            )
                                                          }
                                                          className="mt-1"
                                                        />
                                                      </div>

                                                      {/* Video Link */}
                                                      <div>
                                                        <label className="text-xs font-medium">Video Solution</label>
                                                        <Input
                                                          placeholder="URL to video"
                                                          value={problem.videoLink || ""}
                                                          onChange={(e) =>
                                                            handleEditProblemChange(
                                                              sectionIndex,
                                                              topicIndex,
                                                              problemIndex,
                                                              "videoLink",
                                                              e.target.value,
                                                            )
                                                          }
                                                          className="mt-1"
                                                        />
                                                      </div>

                                                      {/* Editorial Link */}
                                                      <div>
                                                        <label className="text-xs font-medium">Editorial Link</label>
                                                        <Input
                                                          placeholder="URL to editorial"
                                                          value={problem.editorialLink || ""}
                                                          onChange={(e) =>
                                                            handleEditProblemChange(
                                                              sectionIndex,
                                                              topicIndex,
                                                              problemIndex,
                                                              "editorialLink",
                                                              e.target.value,
                                                            )
                                                          }
                                                          className="mt-1"
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                ))
                                              ) : (
                                                <div className="text-center py-2 text-xs text-muted-foreground">
                                                  No problems found. Add a problem to get started.
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-center py-2 text-xs text-muted-foreground">
                                        No topics found. Add a topic to get started.
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No sections found. Add a section to get started.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
                </div>
              )}

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleUpdateSheet} disabled={isEditing || !isEditFormValid()}>
                  {isEditing ? "Updating..." : "Update Sheet"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-4">
          <Input
            placeholder="Search sheets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {filteredSheets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No sheets found</div>
          ) : (
            <Accordion type="multiple" className="space-y-4">
              {filteredSheets.map((sheet) => (
                <AccordionItem key={sheet._id} value={sheet._id} className="border rounded-lg overflow-hidden">
                  <div className="flex items-center">
                    <AccordionTrigger className="px-4 py-3 flex-grow hover:no-underline">
                      <div className="flex items-center justify-between flex-grow">
                        <div>
                          <h3 className="font-medium text-left">{sheet.title}</h3>
                          <p className="text-sm text-muted-foreground text-left">{sheet.totalProblems} problems</p>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <div className="flex space-x-2 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async (e) => {
                          e.stopPropagation();
                          await handleEditSheet(sheet);
                        }}
                      >
                        <FileEdit size={16} className="mr-2" />
                        Edit
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm" onClick={() => setSheetToDelete(sheet)}>
                            <Trash size={16} className="mr-2" />
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Sheet</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete "{sheetToDelete?.title}"? This will also delete all user
                              progress for this sheet.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button variant="destructive" onClick={handleDeleteSheet} disabled={isDeleting}>
                              {isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                      <p className="text-sm">{sheet.description}</p>

                      {/* Show a preview of sections and topics */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Sections:</h4>
                        <ul className="text-sm space-y-1 ml-4">
                          {sheet.sections?.map((section) => (
                            <li key={section.id}>
                              {section.title} ({section.topics.length} topics)
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

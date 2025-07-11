import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabase/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  UserCheck,
  UserX,
  Eye,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  admission_date: string;
  status: string;
  left_date?: string;
  left_reason?: string;
  remarks?: string;
  school?: { name: string };
  class?: { name: string };
  parent?: {
    father_name: string;
    mother_name: string;
    address: string;
    father_phone: string;
    mother_phone: string;
    email: string;
  };
  student_subjects?: Array<{
    subject: { name: string; description: string };
    status: string;
  }>;
}

interface School {
  id: string;
  name: string;
}

interface Class {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
  description: string;
}

interface Parent {
  id: string;
  father_name: string;
  mother_name: string;
  address: string;
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

  const [newStudent, setNewStudent] = useState({
    student_id: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    school_name: "",
    class_id: "",
    father_name: "",
    father_phone: "",
    father_occupation: "",
    mother_name: "",
    mother_phone: "",
    mother_occupation: "",
    parent_address: "",
    parent_email: "",
    selected_subjects: [] as string[],
    remarks: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch students with related data
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select(
          `
          *,
          school:schools(name),
          class:classes(name),
          parent:parents(father_name, mother_name, address, father_phone, mother_phone, email),
          student_subjects(
            subject:subjects(name, description),
            status
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (studentsError) throw studentsError;

      // Fetch schools
      const { data: schoolsData, error: schoolsError } = await supabase
        .from("schools")
        .select("*")
        .order("name");

      if (schoolsError) throw schoolsError;

      // Fetch classes
      const { data: classesData, error: classesError } = await supabase
        .from("classes")
        .select("*")
        .order("name");

      if (classesError) throw classesError;

      // Fetch subjects
      const { data: subjectsData, error: subjectsError } = await supabase
        .from("subjects")
        .select("*")
        .order("name");

      if (subjectsError) throw subjectsError;

      // Fetch parents
      const { data: parentsData, error: parentsError } = await supabase
        .from("parents")
        .select("*")
        .order("father_name");

      if (parentsError) throw parentsError;

      setStudents(studentsData || []);
      setSchools(schoolsData || []);
      setClasses(classesData || []);
      setSubjects(subjectsData || []);
      setParents(parentsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass =
      !selectedClass || student.class?.name === selectedClass;
    const matchesSchool =
      !selectedSchool || student.school?.name === selectedSchool;

    return matchesSearch && matchesClass && matchesSchool;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case "name":
        aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
        bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
        break;
      case "student_id":
        aValue = a.student_id.toLowerCase();
        bValue = b.student_id.toLowerCase();
        break;
      case "admission_date":
        aValue = new Date(a.admission_date).getTime();
        bValue = new Date(b.admission_date).getTime();
        break;
      case "class":
        aValue = a.class?.name?.toLowerCase() || "";
        bValue = b.class?.name?.toLowerCase() || "";
        break;
      case "school":
        aValue = a.school?.name?.toLowerCase() || "";
        bValue = b.school?.name?.toLowerCase() || "";
        break;
      default:
        aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
        bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const activeStudents = sortedStudents.filter((s) => s.status === "Active");
  const leftStudents = sortedStudents.filter((s) => s.status === "Left");

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentActiveStudents = activeStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent,
  );
  const currentLeftStudents = leftStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent,
  );
  const totalActivePages = Math.ceil(activeStudents.length / studentsPerPage);
  const totalLeftPages = Math.ceil(leftStudents.length / studentsPerPage);

  const handleAddStudent = async () => {
    try {
      // First, create or get school
      let schoolId = null;
      if (newStudent.school_name) {
        const existingSchool = schools.find(
          (s) => s.name.toLowerCase() === newStudent.school_name.toLowerCase(),
        );
        if (existingSchool) {
          schoolId = existingSchool.id;
        } else {
          const { data: schoolData, error: schoolError } = await supabase
            .from("schools")
            .insert([{ name: newStudent.school_name }])
            .select()
            .single();
          if (schoolError) throw schoolError;
          schoolId = schoolData.id;
        }
      }

      // Create parent
      const { data: parentData, error: parentError } = await supabase
        .from("parents")
        .insert([
          {
            father_name: newStudent.father_name,
            father_phone: newStudent.father_phone,
            father_occupation: newStudent.father_occupation,
            mother_name: newStudent.mother_name,
            mother_phone: newStudent.mother_phone,
            mother_occupation: newStudent.mother_occupation,
            address: newStudent.parent_address,
            email: newStudent.parent_email,
          },
        ])
        .select()
        .single();

      if (parentError) throw parentError;

      // Create student
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .insert([
          {
            student_id: newStudent.student_id,
            first_name: newStudent.first_name,
            last_name: newStudent.last_name,
            date_of_birth: newStudent.date_of_birth,
            gender: newStudent.gender,
            phone: newStudent.phone,
            email: newStudent.email,
            address: newStudent.address,
            school_id: schoolId,
            class_id: newStudent.class_id,
            parent_id: parentData.id,
            admission_date: new Date().toISOString().split("T")[0],
            status: "Active",
            remarks: newStudent.remarks,
          },
        ])
        .select()
        .single();

      if (studentError) throw studentError;

      // Add selected subjects
      if (newStudent.selected_subjects.length > 0) {
        const subjectInserts = newStudent.selected_subjects.map(
          (subjectId) => ({
            student_id: studentData.id,
            subject_id: subjectId,
            enrollment_date: new Date().toISOString().split("T")[0],
            status: "Active",
          }),
        );

        const { error: subjectError } = await supabase
          .from("student_subjects")
          .insert(subjectInserts);

        if (subjectError) throw subjectError;
      }

      toast({
        title: "Success",
        description: "Student added successfully",
      });

      setIsAddDialogOpen(false);
      setNewStudent({
        student_id: "",
        first_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        school_name: "",
        class_id: "",
        father_name: "",
        father_phone: "",
        father_occupation: "",
        mother_name: "",
        mother_phone: "",
        mother_occupation: "",
        parent_address: "",
        parent_email: "",
        selected_subjects: [],
        remarks: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error adding student:", error);
      toast({
        title: "Error",
        description: "Failed to add student",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStudent = async (student: Student) => {
    try {
      const { error } = await supabase
        .from("students")
        .update({
          first_name: student.first_name,
          last_name: student.last_name,
          date_of_birth: student.date_of_birth,
          gender: student.gender,
          phone: student.phone,
          email: student.email,
          address: student.address,
          status: student.status,
          left_date: student.left_date,
          left_reason: student.left_reason,
          remarks: student.remarks,
        })
        .eq("id", student.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student updated successfully",
      });

      setEditingStudent(null);
      fetchData();
    } catch (error) {
      console.error("Error updating student:", error);
      toast({
        title: "Error",
        description: "Failed to update student",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", studentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student deleted successfully",
      });

      fetchData();
    } catch (error) {
      console.error("Error deleting student:", error);
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive",
      });
    }
  };

  const markAsLeft = async (
    studentId: string,
    leftDate: string,
    leftReason: string,
  ) => {
    try {
      const { error } = await supabase
        .from("students")
        .update({
          status: "Left",
          left_date: leftDate,
          left_reason: leftReason,
        })
        .eq("id", studentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student marked as left",
      });

      fetchData();
    } catch (error) {
      console.error("Error marking student as left:", error);
      toast({
        title: "Error",
        description: "Failed to update student status",
        variant: "destructive",
      });
    }
  };

  const markAsActive = async (studentId: string) => {
    try {
      const { error } = await supabase
        .from("students")
        .update({
          status: "Active",
          left_date: null,
          left_reason: null,
        })
        .eq("id", studentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student moved back to active list",
      });

      fetchData();
    } catch (error) {
      console.error("Error marking student as active:", error);
      toast({
        title: "Error",
        description: "Failed to update student status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20 backdrop-blur-3xl relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/20 to-orange-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-100/20 to-orange-200/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-50/10 to-orange-100/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Student Management
            </h1>
            <p className="text-gray-600 mt-1">Manage VHP tuition students</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col backdrop-blur-xl bg-white/95 border border-white/20 shadow-2xl rounded-3xl">
              <DialogHeader className="flex-shrink-0 pb-4 border-b border-white/10">
                <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  Add New Student
                </DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto px-1 py-4 scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="student_id">Student ID</Label>
                    <Input
                      id="student_id"
                      value={newStudent.student_id}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          student_id: e.target.value,
                        })
                      }
                      placeholder="VHP0001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={newStudent.first_name}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          first_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={newStudent.last_name}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          last_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={newStudent.date_of_birth}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          date_of_birth: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={newStudent.gender}
                      onValueChange={(value) =>
                        setNewStudent({ ...newStudent, gender: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newStudent.phone}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStudent.email}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="school_name">School Name</Label>
                    <Input
                      id="school_name"
                      value={newStudent.school_name}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          school_name: e.target.value,
                        })
                      }
                      placeholder="Enter school name"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      If school doesn't exist, it will be created automatically
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="class_id">Class</Label>
                    <Select
                      value={newStudent.class_id}
                      onValueChange={(value) =>
                        setNewStudent({ ...newStudent, class_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="father_name">Father's Name</Label>
                    <Input
                      id="father_name"
                      value={newStudent.father_name}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          father_name: e.target.value,
                        })
                      }
                      placeholder="Enter father's name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="father_phone">Father's Phone</Label>
                    <Input
                      id="father_phone"
                      value={newStudent.father_phone}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          father_phone: e.target.value,
                        })
                      }
                      placeholder="Enter father's phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="father_occupation">
                      Father's Occupation
                    </Label>
                    <Input
                      id="father_occupation"
                      value={newStudent.father_occupation}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          father_occupation: e.target.value,
                        })
                      }
                      placeholder="Enter father's occupation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mother_name">Mother's Name</Label>
                    <Input
                      id="mother_name"
                      value={newStudent.mother_name}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          mother_name: e.target.value,
                        })
                      }
                      placeholder="Enter mother's name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mother_phone">Mother's Phone</Label>
                    <Input
                      id="mother_phone"
                      value={newStudent.mother_phone}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          mother_phone: e.target.value,
                        })
                      }
                      placeholder="Enter mother's phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mother_occupation">
                      Mother's Occupation
                    </Label>
                    <Input
                      id="mother_occupation"
                      value={newStudent.mother_occupation}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          mother_occupation: e.target.value,
                        })
                      }
                      placeholder="Enter mother's occupation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="parent_email">Parent Email</Label>
                    <Input
                      id="parent_email"
                      type="email"
                      value={newStudent.parent_email}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          parent_email: e.target.value,
                        })
                      }
                      placeholder="Enter parent email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Student Address</Label>
                    <Textarea
                      id="address"
                      value={newStudent.address}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          address: e.target.value,
                        })
                      }
                      placeholder="Enter student address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="parent_address">Parent Address</Label>
                    <Textarea
                      id="parent_address"
                      value={newStudent.parent_address}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          parent_address: e.target.value,
                        })
                      }
                      placeholder="Enter parent address"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Select Subjects</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2 max-h-32 overflow-y-auto border rounded p-2">
                      {subjects.map((subject) => (
                        <div
                          key={subject.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={subject.id}
                            checked={newStudent.selected_subjects.includes(
                              subject.id,
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewStudent({
                                  ...newStudent,
                                  selected_subjects: [
                                    ...newStudent.selected_subjects,
                                    subject.id,
                                  ],
                                });
                              } else {
                                setNewStudent({
                                  ...newStudent,
                                  selected_subjects:
                                    newStudent.selected_subjects.filter(
                                      (id) => id !== subject.id,
                                    ),
                                });
                              }
                            }}
                          />
                          <Label htmlFor={subject.id} className="text-xs">
                            {subject.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="remarks">Remarks</Label>
                    <Textarea
                      id="remarks"
                      value={newStudent.remarks}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          remarks: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 flex justify-end space-x-3 pt-4 border-t border-white/10">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="px-6 py-2 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddStudent}
                  className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Add Student
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search, Filters, and Sorting */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedClass || "all"}
            onValueChange={(value) =>
              setSelectedClass(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.name}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedSchool || "all"}
            onValueChange={(value) =>
              setSelectedSchool(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by school" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schools</SelectItem>
              {schools.map((school) => (
                <SelectItem key={school.id} value={school.name}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="student_id">Student ID</SelectItem>
              <SelectItem value="admission_date">Admission Date</SelectItem>
              <SelectItem value="class">Class</SelectItem>
              <SelectItem value="school">School</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center gap-2"
          >
            {sortOrder === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="backdrop-blur-xl bg-white/80 border border-white/20 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent">
                Total Students
              </CardTitle>
              <div className="p-2 rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                {students.length}
              </div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-white/80 border border-white/20 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent">
                Active Students
              </CardTitle>
              <div className="p-2 rounded-full bg-gradient-to-br from-green-100 to-green-200">
                <UserCheck className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                {activeStudents.length}
              </div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-white/80 border border-white/20 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent">
                Left Students
              </CardTitle>
              <div className="p-2 rounded-full bg-gradient-to-br from-red-100 to-red-200">
                <UserX className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                {leftStudents.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Lists */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Active Students ({activeStudents.length})
            </TabsTrigger>
            <TabsTrigger value="left">
              Left Students ({leftStudents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Showing {indexOfFirstStudent + 1} to{" "}
                {Math.min(indexOfLastStudent, activeStudents.length)} of{" "}
                {activeStudents.length} active students
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalActivePages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalActivePages),
                    )
                  }
                  disabled={currentPage === totalActivePages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {currentActiveStudents.map((student, index) => (
              <Card
                key={student.id}
                className="backdrop-blur-xl bg-white/90 border border-white/20 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {student.first_name} {student.last_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          ID: {student.student_id}
                        </p>
                        <p className="text-sm text-gray-600">
                          DOB: {student.date_of_birth}
                        </p>
                        <p className="text-sm text-gray-600">
                          Gender: {student.gender}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">
                          <strong>School:</strong> {student.school?.name}
                        </p>
                        <p className="text-sm">
                          <strong>Class:</strong> {student.class?.name}
                        </p>
                        <p className="text-sm">
                          <strong>Phone:</strong> {student.phone}
                        </p>
                        <p className="text-sm">
                          <strong>Email:</strong> {student.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">
                          <strong>Parent:</strong> {student.parent?.father_name}
                        </p>
                        <p className="text-sm">
                          <strong>Parent Phone:</strong>{" "}
                          {student.parent?.father_phone}
                        </p>
                        <p className="text-sm">
                          <strong>Admission:</strong> {student.admission_date}
                        </p>
                        <Badge className="bg-green-100 text-green-800">
                          {student.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewingStudent(student)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingStudent(student)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const leftDate = prompt(
                            "Enter left date (YYYY-MM-DD):",
                          );
                          const leftReason = prompt(
                            "Enter reason for leaving:",
                          );
                          if (leftDate && leftReason) {
                            markAsLeft(student.id, leftDate, leftReason);
                          }
                        }}
                      >
                        Mark as Left
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {student.remarks && (
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <p className="text-sm">
                        <strong>Remarks:</strong> {student.remarks}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="left" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Showing {indexOfFirstStudent + 1} to{" "}
                {Math.min(indexOfLastStudent, leftStudents.length)} of{" "}
                {leftStudents.length} left students
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalLeftPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalLeftPages))
                  }
                  disabled={currentPage === totalLeftPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {currentLeftStudents.map((student, index) => (
              <Card
                key={student.id}
                className="backdrop-blur-xl bg-white/90 border border-white/20 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {student.first_name} {student.last_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          ID: {student.student_id}
                        </p>
                        <p className="text-sm text-gray-600">
                          DOB: {student.date_of_birth}
                        </p>
                        <p className="text-sm text-gray-600">
                          Gender: {student.gender}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">
                          <strong>School:</strong> {student.school?.name}
                        </p>
                        <p className="text-sm">
                          <strong>Class:</strong> {student.class?.name}
                        </p>
                        <p className="text-sm">
                          <strong>Phone:</strong> {student.phone}
                        </p>
                        <p className="text-sm">
                          <strong>Email:</strong> {student.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">
                          <strong>Left Date:</strong> {student.left_date}
                        </p>
                        <p className="text-sm">
                          <strong>Left Reason:</strong> {student.left_reason}
                        </p>
                        <p className="text-sm">
                          <strong>Admission:</strong> {student.admission_date}
                        </p>
                        <Badge className="bg-red-100 text-red-800">
                          {student.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewingStudent(student)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingStudent(student)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to move this student back to active list?",
                            )
                          ) {
                            markAsActive(student.id);
                          }
                        }}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {student.remarks && (
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <p className="text-sm">
                        <strong>Remarks:</strong> {student.remarks}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Edit Student Dialog */}
        <Dialog
          open={!!editingStudent}
          onOpenChange={() => setEditingStudent(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col backdrop-blur-xl bg-white/95 border border-white/20 shadow-2xl rounded-3xl">
            <DialogHeader className="flex-shrink-0 pb-4 border-b border-white/10">
              <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Edit Student Details
              </DialogTitle>
            </DialogHeader>
            {editingStudent && (
              <div className="flex-1 overflow-y-auto px-1 py-4 scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_first_name">First Name</Label>
                    <Input
                      id="edit_first_name"
                      value={editingStudent.first_name}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          first_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_last_name">Last Name</Label>
                    <Input
                      id="edit_last_name"
                      value={editingStudent.last_name}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          last_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_date_of_birth">Date of Birth</Label>
                    <Input
                      id="edit_date_of_birth"
                      type="date"
                      value={editingStudent.date_of_birth}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          date_of_birth: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_gender">Gender</Label>
                    <Select
                      value={editingStudent.gender}
                      onValueChange={(value) =>
                        setEditingStudent({ ...editingStudent, gender: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit_phone">Phone</Label>
                    <Input
                      id="edit_phone"
                      value={editingStudent.phone}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_email">Email</Label>
                    <Input
                      id="edit_email"
                      type="email"
                      value={editingStudent.email}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="edit_address">Address</Label>
                    <Textarea
                      id="edit_address"
                      value={editingStudent.address}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_status">Status</Label>
                    <Select
                      value={editingStudent.status}
                      onValueChange={(value) =>
                        setEditingStudent({ ...editingStudent, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Left">Left</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {editingStudent.status === "Left" && (
                    <>
                      <div>
                        <Label htmlFor="edit_left_date">Left Date</Label>
                        <Input
                          id="edit_left_date"
                          type="date"
                          value={editingStudent.left_date || ""}
                          onChange={(e) =>
                            setEditingStudent({
                              ...editingStudent,
                              left_date: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="edit_left_reason">Left Reason</Label>
                        <Textarea
                          id="edit_left_reason"
                          value={editingStudent.left_reason || ""}
                          onChange={(e) =>
                            setEditingStudent({
                              ...editingStudent,
                              left_reason: e.target.value,
                            })
                          }
                        />
                      </div>
                    </>
                  )}
                  <div className="col-span-2">
                    <Label htmlFor="edit_remarks">Remarks</Label>
                    <Textarea
                      id="edit_remarks"
                      value={editingStudent.remarks || ""}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          remarks: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex-shrink-0 flex justify-end space-x-3 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                onClick={() => setEditingStudent(null)}
                className="px-6 py-2 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  editingStudent && handleUpdateStudent(editingStudent)
                }
                className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Update Student
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Student Dialog */}
        <Dialog
          open={!!viewingStudent}
          onOpenChange={() => setViewingStudent(null)}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Student Details</DialogTitle>
            </DialogHeader>
            {viewingStudent && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Personal Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Student ID:</strong> {viewingStudent.student_id}
                    </p>
                    <p>
                      <strong>Name:</strong> {viewingStudent.first_name}{" "}
                      {viewingStudent.last_name}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong>{" "}
                      {viewingStudent.date_of_birth}
                    </p>
                    <p>
                      <strong>Gender:</strong> {viewingStudent.gender}
                    </p>
                    <p>
                      <strong>Phone:</strong> {viewingStudent.phone}
                    </p>
                    <p>
                      <strong>Email:</strong> {viewingStudent.email}
                    </p>
                    <p>
                      <strong>Address:</strong> {viewingStudent.address}
                    </p>
                    <p>
                      <strong>School:</strong> {viewingStudent.school?.name}
                    </p>
                    <p>
                      <strong>Class:</strong> {viewingStudent.class?.name}
                    </p>
                    <p>
                      <strong>Admission Date:</strong>{" "}
                      {viewingStudent.admission_date}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <Badge
                        className={
                          viewingStudent.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {viewingStudent.status}
                      </Badge>
                    </p>
                    {viewingStudent.left_date && (
                      <>
                        <p>
                          <strong>Left Date:</strong> {viewingStudent.left_date}
                        </p>
                        <p>
                          <strong>Left Reason:</strong>{" "}
                          {viewingStudent.left_reason}
                        </p>
                      </>
                    )}
                    {viewingStudent.remarks && (
                      <p>
                        <strong>Remarks:</strong> {viewingStudent.remarks}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Parent Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Father's Name:</strong>{" "}
                      {viewingStudent.parent?.father_name}
                    </p>
                    <p>
                      <strong>Father's Phone:</strong>{" "}
                      {viewingStudent.parent?.father_phone}
                    </p>
                    <p>
                      <strong>Mother's Name:</strong>{" "}
                      {viewingStudent.parent?.mother_name}
                    </p>
                    <p>
                      <strong>Mother's Phone:</strong>{" "}
                      {viewingStudent.parent?.mother_phone}
                    </p>
                    <p>
                      <strong>Parent Email:</strong>{" "}
                      {viewingStudent.parent?.email}
                    </p>
                    <p>
                      <strong>Parent Address:</strong>{" "}
                      {viewingStudent.parent?.address}
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6">
                    Subjects
                  </h3>
                  <div className="space-y-2">
                    {viewingStudent.student_subjects &&
                    viewingStudent.student_subjects.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2">
                        {viewingStudent.student_subjects.map((ss, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 bg-gray-50 rounded"
                          >
                            <div>
                              <p className="font-medium">{ss.subject.name}</p>
                              <p className="text-sm text-gray-600">
                                {ss.subject.description}
                              </p>
                            </div>
                            <Badge
                              className={
                                ss.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {ss.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No subjects assigned</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <br />
      {/* Footer */}
      <footer className="bg-orange-50 py-10 text-sm text-gray-700">
        <div className="max-w-6xl mx-auto px-4 space-y-8">

          {/* VHP Info and Logo */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex items-center space-x-3">
              <img
                src="/VHP_S_Logo.png"
                alt="VHP Logo"
                className="h-20 w-20"
              />
              <div>
                <h2 className="text-orange-600 font-bold text-lg">
                  VHP Tuition Management
                </h2>
                <p className="text-gray-600 mt-1 max-w-md">
                  A student information management system built for Vishva Hindu Parishad to organize tuition center records efficiently and securely.
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="text-gray-700 text-sm space-y-2">
              <div>
                <span className="font-medium">VHP Contact:</span><br />
                📞 +9111-26103495<br />
                ✉️ contactus@vhp.org
              </div>
              <div>
                <span className="font-medium">Developer:</span><br />
                👨‍💻 <a
                  href="https://www.linkedin.com/in/sanjay-a-749a90223/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:underline"
                >
                  Sanjay A (LinkedIn)
                </a><br />
                🎓 RA2311008020159 <br />
                📱 +91-99430-34411
              </div>
            </div>
          </div>

          {/* Thank you and SRM Logo */}
          <div className="border-t border-orange-200 pt-6 text-center space-y-2">
            <div className="flex justify-center items-center gap-3">
              <img
                src="/SRM_Logo.jpg"
                alt="SRM Logo"
                className="h-20 object-contain"
              />
              <p className="text-gray-600">
                With sincere thanks to <strong>SRM Institute of Science and Technology</strong> for support and guidance.
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              © {new Date().getFullYear()} Vishva Hindu Parishad Educational System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
